import { fork, Worker } from "cluster";
import { Socket } from "./socket";
import { dirname } from "path";
import { writeFileSync, readFileSync, watch, existsSync, mkdirSync, exists, unlinkSync } from "fs";
import * as Path from "path";
import { Log } from "./log";
// import "./dashboard/server";
import { Generator } from "./Generator";
import * as Glob from "glob";
import { ensureDirectoryExistence, ensureDirectory } from "./Util";
import { Options } from "./Options";
import { PluginManager } from "./PluginManager";
import { updateWorkers } from "./dashboard/server";
var chokidar = require("chokidar");
// import { updateData } from "./dashboard/server";

type Dependencies = { [key: string]: string };

interface IFile {
    contents: string;
    sourceMap?: string;
    source?: string;
    dependencies: Dependencies;
    dependants: string[];
}

var workers = 8;

function debounce(Fn, Wait, Immediate?) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!Immediate) Fn.apply(context, args);
        };
        var callNow = Immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, Wait);
        if (callNow) Fn.apply(context, args);
    };
}


class App {
    private _isPatch: boolean = false;
    private _oldDeps: Dependencies;
    private _sockets: Socket[] = [];
    private _iterator = -1;
    private _done: { [pid: number]: boolean } = new Proxy({}, {
        get: function (Obj, Prop) {
            return Obj[Prop];
        },
        set: function (Obj, Prop, Val) {
            if (Obj[Prop]) {
                Obj[Prop] = Val;
                updateWorkers(Obj);
            } else {
                Obj[Prop] = Val;
            }
            return true;
        }
    });
    public files: { [key: string]: IFile } = {};
    public bundles: string[] = [];
    public styles: { [key: string]: string } = {};
    public outDir = Path.resolve("./.build");

    private _getName(FilePath) {
        return Path.relative(process.cwd(), FilePath);
    }

    public isCached(DependencyPath) {
        let cached = Path.join(process.cwd(), ".cache", DependencyPath) + ".json";
        return existsSync(cached);
    }

    public includeCached(DependencyPath) {
        var self = this.files[DependencyPath] = JSON.parse(readFileSync(Path.join(process.cwd(), ".cache", DependencyPath) + ".json", "utf8"));
        for (var dep of (Object.values(self.dependencies) as string[])) {
            // console.log(dep);
            if (!this.files[dep]) {
                if (this.isCached(dep)) {
                    this.includeCached(dep);
                } else {
                    var p = Path.resolve(dep);
                    // var dir = Path.dirname(p);
                    this.files[dep] = {
                        dependants: [],
                        contents: "",
                        dependencies: {}
                    };
                    this.sendToWorker("findDependencies", p);
                }
            }
        }
        return self;
    }

    private _shouldCache(FilePath: string) {
        return ~FilePath.indexOf("node_modules");
    }

    public run(): void {
        Options.Load();
        ensureDirectory(this.outDir);
        chokidar.watch(process.cwd(), { ignored: /((^|[\/\\])\..|node_modules)/ }).on("all", (Type, FilePath) => {
            if (Type == "change") {
                if (this.files[this._getName(FilePath)]) {
                    this._isPatch = true;
                    Log.Info("project file changed");
                    this._oldDeps = { ...this.files[this._getName(FilePath)].dependencies };
                    this.files[this._getName(FilePath)].dependencies = {};
                    Log.Time();
                    this.sendToWorker("findDependencies", this._getName(FilePath));
                }
            }
        });
        Log.Time();
        this.startWorkers();
        PluginManager.OnAddPlugin((Name) => {
            this._sockets.forEach(Sock => { Sock.send("plugin", Name); });
        });
        PluginManager.LoadPlugin("TypeScript");
        PluginManager.LoadPlugin("JavaScript");
        PluginManager.LoadPlugin("SASS");
        Options.OnChange((Opts) => {
            this._sockets.forEach((Sock) => { Sock.send("options", Opts); });
            this.files = {};
            Log.Info("Options changed, rebuilding");
            Log.Time();
            files.forEach(File => this.resolveFile(File, process.cwd(), "bundle"));
        });

        // var target = path.resolve(process.argv[2]);
        // this.entry = this._getName(target);
        // if (process.argv[2] == "config") {
        require("./dashboard/server");
        // return;
        // }

        var files = [];
        for (var i = 2; i < process.argv.length; i++) {
            if (/\\(.)|(^!|[*?{}()[\]]|\(\?)/.test(process.argv[i])) {
                for (var file of Glob.sync(process.argv[i])) {
                    if (!~files.indexOf(file)) {
                        files.push(file);
                        Log.Info("Building " + file);
                        this.resolveFile(file, process.cwd(), "bundle");
                    }
                }
            } else {
                var file = process.argv[i];
                files.push(file);
                Log.Info("Building " + file);
                this.resolveFile(file, process.cwd(), "bundle");
            }
        }
        // this.sendToWorker("findDependencies", process.argv[2]);

        // resolve("express", { basedir: process.cwd() }, (err, filepath) => {
        //     this.sendToWorker("file", "express", process.cwd(), "test.js");
        // })
    }

    public resolveFile(FilePath: string, BaseDirectory: string, Parent: string) {
        this.sendToWorker("file", FilePath, BaseDirectory, Parent);
    }

    public startWorkers() {
        for (var i = 0; i < workers; i++) {
            let cp = fork();
            let socket = new Socket(cp);
            this._done[cp.id] = true;

            socket.send("options", Options.Get());

            socket.on("resolved", this.onResolved);

            socket.on("done", () => {
                this.onDone(cp);
            });

            socket.on("fileContents", this.onFileContents);
            socket.on("dependency", this.onDependency);
            socket.on("style", this.onStyle);
            socket.on("sourcemap", this.onSourceMap);
            socket.on("error", () => {
                process.exit(1);
            });
            this._sockets.push(socket);
        }
    }

    public onSourceMap = (FilePath: string, Source: string, SourceMap: string) => {
        var file = this.files[this._getName(FilePath)];
        file.source = Source;
        file.sourceMap = SourceMap;
    }

    public sendToWorker(Type: string, ...Args: any[]): void {
        if (++this._iterator == workers) {
            this._iterator = 0;
        }
        this._done[this._sockets[this._iterator].socket.id] = false;
        this._sockets[this._iterator].send(Type, ...Args);
    }

    public onBundleEntry = (Name: string, FilePath: string) => {
        if (!this.files[this._getName(FilePath)]) {
            this.bundles.push(this._getName(FilePath));
            this.files[this._getName(FilePath)] = {
                contents: "",
                dependencies: {},
                dependants: []
            };
            this.findDependencies(FilePath);
        }
    }

    public onResolved = (Name, FilePath, ParentPath) => {
        if (ParentPath == "bundle") {
            this.onBundleEntry(Name, FilePath);
            return;
        }
        let dependencyPath = this._getName(FilePath);
        let targetName = this._getName(ParentPath);
        var target = this.files[targetName];
        let self = this.files[dependencyPath];

        target.dependencies[Name] = dependencyPath;

        if (!self && this.isCached(dependencyPath)) {
            self = this.includeCached(dependencyPath);
        } else {
            if (!~Object.values(target.dependencies).indexOf(null)) {
                // if (this._isPatch) {
                //     if (JSON.stringify(target.dependencies) != JSON.stringify(this._oldDeps)) {
                //         // console.log(target.dependencies, this.oldDeps);
                //         var change = false;
                //         for (var dep of Object.keys(this._oldDeps)) {
                //             if (!target.dependencies[dep]) {
                //                 console.log("remove ", dep);
                //                 change = true;
                //                 // console.log(this.files[this.oldDeps[dep]].dependants.length);
                //             }
                //         }
                //         for (var dep of Object.keys(target.dependencies)) {
                //             if (!this._oldDeps[dep]) {
                //                 console.log("add ", dep);
                //                 change = true;
                //             }
                //         }
                //         if (change) {
                //             // Extremely inefficient but effective
                //             this.files = {};
                //             this.files["main"] = {
                //                 dependencies: {},
                //                 dependants: [],
                //                 contents: `require('${process.argv[2]}');`
                //             };
                //             this.sendToWorker("file", process.argv[2], process.cwd(), "main");
                //         }
                //     }
                //     this._isPatch = false;
                // }
                if (this._shouldCache(targetName)) {
                    let cached = Path.join(process.cwd(), ".cache", targetName) + ".json";
                    ensureDirectoryExistence(cached);
                    writeFileSync(cached, JSON.stringify(target));
                }
            }

            if (!self) {
                self = this.files[dependencyPath] = {
                    contents: "",
                    dependencies: {},
                    dependants: []
                };
                this.findDependencies(FilePath);
            }
            self.dependants.push(this._getName(ParentPath));
        }
    }

    public findDependencies(FilePath: string) {
        this.sendToWorker("findDependencies", FilePath);
    }

    public onDone = (Child: Worker) => {
        this._done[Child.id] = true;
        // console.log(this._done);
        if (!~Object.values(this._done).indexOf(false)) {
            onFinish();
            // process.exit(0);
        }
    }

    public onFileContents = (FilePath, Contents) => {
        this.files[this._getName(FilePath)].contents = Contents || "";
    }

    public onStyle = (Name, Contents) => {
        this.styles[Name] = Contents;
    }

    public onDependency = (Name, ParentPath) => {
        this.files[this._getName(ParentPath)].dependencies[Name] = null;
        this.sendToWorker("file", Name, dirname(ParentPath), ParentPath);
    }
}

var app = new App();
app.run();

var onFinish = debounce(async () => {
    try {
        // for (var style in app.styles) {
        //     var name = Path.basename(style, Path.extname(style));
        //     writeFileSync("./.build/" + name + ".bundle.css", app.styles[style]);
        // }
        var manifest = {};
        for (var bundle of app.bundles) {
            var res = await new Generator(app, bundle).run();
            if (Options.Get("Bundler.CacheBuster") == true) {
                manifest[res[1]] = res[0];
            }
        }
        Options.Get("Bundler.CacheBuster") == true && writeFileSync(app.outDir + "/manifest.json", JSON.stringify(manifest));
        Log.TimeEnd("Done in % seconds");
        // process.exit();
        Options.Save();
    } catch (e) {
        console.log(e);
    }
}, 100, false);

export { App, IFile };
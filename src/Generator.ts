import { App, IFile } from "./master";
import * as FileSystem from "fs";
import * as Path from "path";
import { SourceMapGenerator, SourceMapConsumer } from "source-map";
import * as Cryptology from "crypto";
import { ensureDirectoryExistence } from "./Util";
import { Options } from "./Options";

let header = `(function(files, entry) {
    window.global = window;
    global.process = {env: {NODE_ENV:"development"}, cwd: function(){return '/'}};
    window.cache = {};
    var exportGetter = function() {
        return this;
    }
    var require = function(file, name) {
        var module = {exports: {}};
        if(cache[files[file][1][name]]) {
            return cache[files[file][1][name]].exports;
        }else {
            var newfile = files[file][1][name];
            if(files[newfile]) {
                cache[newfile] = {exports: {}}
                files[newfile][0](require.bind(null, newfile), cache[newfile].exports, cache[newfile]);
        
                if(cache[newfile].exports && cache[newfile].exports.hasOwnProperty && !cache[newfile].exports.hasOwnProperty("default") && Object.isExtensible(cache[newfile].exports)) {
                    Object.defineProperty(cache[newfile].exports, "default", {get:exportGetter})
                }

                return cache[newfile].exports;
            } else {
                throw new Error("Cannot find module "+name+" from "+file);
            }
        }
    }
    files[entry][0](require.bind(null, entry), {}, {});
})({
`;

export class Generator {
    public fileStream: FileSystem.WriteStream;
    public app: App;
    public files: string[] = [];
    public currentLine = 30;
    public map: SourceMapGenerator;
    public bundle: string;
    hash: Cryptology.Hash;
    private _cacheBuster: boolean;

    constructor(AppInstance: App, Bundle: string) {
        this.bundle = Bundle;
        this.app = AppInstance;
        this._cacheBuster = Options.Get("Bundler.CacheBuster");
    }
    public async run() {
        return new Promise<string[]>(Resolve => {
            var name = Path.basename(this.bundle, Path.extname(this.bundle));
            this.map = new SourceMapGenerator({
                file: name + ".bundle.js"
            });
            // if (!FileSystem.existsSync(".build")) {
            //     FileSystem.mkdirSync(".build");
            // }
            ensureDirectoryExistence(this.app.outDir);
            // FileSystem.mkdirSync(this.app.outDir);
            for (var key of FileSystem.readdirSync(this.app.outDir)) {
                if (key.indexOf(name + ".") == 0) {
                    FileSystem.unlinkSync(Path.join(this.app.outDir, key));
                }
            }
            this.fileStream = FileSystem.createWriteStream(this.app.outDir + "/" + name + ".bundle.js");
            this.fileStream.write(header);
            if (this._cacheBuster) {
                this.hash = Cryptology.createHash("md5");
                this.hash.write(header);
            }
            this.searchDependencies(this.bundle);
            this.fileStream.on("finish", () => {
                // console.log(this.hash.digest("hex"));
                if (this._cacheBuster) {
                    let hash = this.hash.digest("hex");
                    FileSystem.renameSync(this.app.outDir + "/" + name + ".bundle.js", this.app.outDir + "/" + name + "." + hash + ".js");
                    Resolve([name + "." + hash + ".js", name]);
                } else {
                    Resolve();
                }
            });
            this.fileStream.write(`\n}, "${this.bundle}")\n`);
            this.fileStream.write("//@ sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(this.map.toString()).toString("base64"));
            this.fileStream.end();
        });
    }

    public searchDependencies(FilePath: string) {
        if (!this.app.files[FilePath]) {
            console.log(FilePath);
        }
        var lines = this.app.files[FilePath].contents.split("\n").length;
        if (!this.app.files[FilePath].sourceMap) {
            this.map.setSourceContent(FilePath, this.app.files[FilePath].contents);
            for (var i = 1; i < lines + 1; i++) {
                this.map.addMapping({
                    source: FilePath,
                    original: { line: i, column: 0 },
                    generated: { line: this.currentLine + i, column: 0 }
                });
            }
        } else {
            var consumer = new SourceMapConsumer(JSON.parse(this.app.files[FilePath].sourceMap));
            this.app.files[FilePath].source && this.map.setSourceContent(FilePath, this.app.files[FilePath].source);

            consumer.eachMapping((Mapping) => {
                this.map.addMapping({
                    source: FilePath,
                    original: { line: Mapping.originalLine, column: Mapping.originalColumn },
                    generated: { line: this.currentLine + Mapping.generatedLine, column: Mapping.generatedColumn }
                });
            });
        }
        this.currentLine += lines + 2;
        var content = `"${FilePath}": [function(require, exports, module) {\n${this.app.files[FilePath].contents}\n}, ${JSON.stringify(this.app.files[FilePath].dependencies)}],\n`;
        this.fileStream.write(content);
        if (this._cacheBuster) {
            this.hash.write(content);
        }
        Object.values(this.app.files[FilePath].dependencies).forEach((Dependency: string) => {
            if (!~this.files.indexOf(Dependency)) {
                this.files.push(Dependency);
                this.searchDependencies(Dependency);
            }
        });
    }
}
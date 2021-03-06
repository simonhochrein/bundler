"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var cluster_1 = require("cluster");
var socket_1 = require("./socket");
var path_1 = require("path");
var fs_1 = require("fs");
var Path = require("path");
var log_1 = require("./log");
// import "./dashboard/server";
var Generator_1 = require("./Generator");
var Util_1 = require("./Util");
var PluginManager_1 = require("./PluginManager");
var chokidar = require("chokidar");
var workers = 8;
function debounce(Fn, Wait, Immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!Immediate)
                Fn.apply(context, args);
        };
        var callNow = Immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, Wait);
        if (callNow)
            Fn.apply(context, args);
    };
}
var App = /** @class */ (function () {
    function App(Arguments) {
        var _this = this;
        this._isPatch = false;
        this._sockets = [];
        this._iterator = -1;
        this._done = new Proxy({}, {
            get: function (Obj, Prop) {
                return Obj[Prop];
            },
            set: function (Obj, Prop, Val) {
                Obj[Prop] = Val;
                return true;
            }
        });
        this.files = {};
        this.bundles = [];
        this.styles = {};
        this.outDir = Path.resolve("./.bundler/build");
        this.onSourceMap = function (FilePath, Source, SourceMap) {
            var file = _this.files[_this._getName(FilePath)];
            file.source = Source;
            file.sourceMap = SourceMap;
        };
        this.onBundleEntry = function (Name, FilePath) {
            if (!_this.files[_this._getName(FilePath)]) {
                _this.bundles.push(_this._getName(FilePath));
                _this.files[_this._getName(FilePath)] = {
                    contents: "",
                    dependencies: {},
                    dependants: []
                };
                _this.findDependencies(FilePath);
            }
        };
        this.onResolved = function (Name, FilePath, ParentPath) {
            if (ParentPath == "bundle") {
                _this.onBundleEntry(Name, FilePath);
                return;
            }
            var dependencyPath = _this._getName(FilePath);
            var targetName = _this._getName(ParentPath);
            var target = _this.files[targetName];
            var self = _this.files[dependencyPath];
            target.dependencies[Name] = dependencyPath;
            if (!self && _this.isCached(dependencyPath)) {
                self = _this.includeCached(dependencyPath);
            }
            else {
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
                    if (_this._shouldCache(targetName)) {
                        var cached = Path.join(process.cwd(), "./.bundler/cache", targetName) + ".json";
                        Util_1.ensureDirectory(cached);
                        fs_1.writeFileSync(cached, JSON.stringify(target));
                    }
                }
                if (!self) {
                    self = _this.files[dependencyPath] = {
                        contents: "",
                        dependencies: {},
                        dependants: []
                    };
                    _this.findDependencies(FilePath);
                }
                self.dependants.push(_this._getName(ParentPath));
            }
        };
        this.onDone = function (Child) {
            _this._done[Child.id] = true;
            // console.log(this._done);
            if (!~Object.values(_this._done).indexOf(false)) {
                onFinish();
                // process.exit(0);
            }
        };
        this.onFileContents = function (FilePath, Contents) {
            _this.files[_this._getName(FilePath)].contents = Contents || "";
        };
        this.onStyle = function (Name, Contents) {
            _this.styles[Name] = Contents;
        };
        this.onDependency = function (Name, ParentPath) {
            _this.files[_this._getName(ParentPath)].dependencies[Name] = null;
            _this.sendToWorker("file", Name, path_1.dirname(ParentPath), ParentPath);
        };
        this.config = require(Path.join(process.cwd(), Arguments._[0]));
        this.run();
    }
    App.prototype._getName = function (FilePath) {
        return Path.relative(process.cwd(), FilePath);
    };
    App.prototype.isCached = function (DependencyPath) {
        var cached = Path.join(process.cwd(), "./.bundler/cache", DependencyPath) + ".json";
        return fs_1.existsSync(cached);
    };
    App.prototype.includeCached = function (DependencyPath) {
        var self = this.files[DependencyPath] = JSON.parse(fs_1.readFileSync(Path.join(process.cwd(), "./.bundler/cache", DependencyPath) + ".json", "utf8"));
        for (var _i = 0, _a = Object.values(self.dependencies); _i < _a.length; _i++) {
            var dep = _a[_i];
            // console.log(dep);
            if (!this.files[dep]) {
                if (this.isCached(dep)) {
                    this.includeCached(dep);
                }
                else {
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
    };
    App.prototype._shouldCache = function (FilePath) {
        return ~FilePath.indexOf("node_modules");
    };
    App.prototype.run = function () {
        var _this = this;
        Util_1.ensureDirectoryExistence(this.outDir);
        chokidar.watch(process.cwd(), { ignored: /((^|[\/\\])\..|node_modules)/ }).on("all", function (Type, FilePath) {
            if (Type == "change") {
                if (_this.files[_this._getName(FilePath)]) {
                    _this._isPatch = true;
                    log_1.Log.Info("project file changed");
                    _this._oldDeps = __assign({}, _this.files[_this._getName(FilePath)].dependencies);
                    _this.files[_this._getName(FilePath)].dependencies = {};
                    log_1.Log.Time();
                    _this.sendToWorker("findDependencies", _this._getName(FilePath));
                }
            }
        });
        log_1.Log.Time();
        this.startWorkers();
        PluginManager_1.PluginManager.OnAddPlugin(function (Name) {
            _this._sockets.forEach(function (Sock) { Sock.send("plugin", Name); });
        });
        // PluginManager.LoadPlugin("TypeScript");
        // PluginManager.LoadPlugin("JavaScript");
        // PluginManager.LoadPlugin("SASS");
        // PluginManager.LoadPlugin("EJS");
        // for (var plugin of Options.Get("Bundler.Plugins")) {
        //     PluginManager.LoadPlugin(plugin);
        // }
        // Options.OnChange((Opts) => {
        //     if (process.argv[2] == "config") {
        //         return;
        //     }
        //     this._sockets.forEach((Sock) => { Sock.send("options", Opts); });
        //     this.files = {};
        //     Log.Info("Options changed, rebuilding");
        //     Log.Time();
        //     files.forEach(File => this.resolveFile(File, process.cwd(), "bundle"));
        // });
        // var target = path.resolve(process.argv[2]);
        // this.entry = this._getName(target);
        for (var _i = 0, _a = Object.keys(this.config.plugins); _i < _a.length; _i++) {
            var plugin = _a[_i];
            PluginManager_1.PluginManager.LoadPlugin(this.config.plugins[plugin]);
        }
        var files = [];
        for (var _b = 0, _c = Object.keys(this.config.entry); _b < _c.length; _b++) {
            var entry = _c[_b];
            var file = this.config.entry[entry];
            files.push(file);
            this.resolveFile(file, process.cwd(), "bundle");
        }
        // for (var i = 2; i < process.argv.length; i++) {
        //     if (/\\(.)|(^!|[*?{}()[\]]|\(\?)/.test(process.argv[i])) {
        //         for (var file of Glob.sync(process.argv[i])) {
        //             if (!~files.indexOf(file)) {
        //                 files.push(file);
        //                 Log.Info("Building " + file);
        //                 this.resolveFile(file, process.cwd(), "bundle");
        //             }
        //         }
        //     } else {
        //         var file = process.argv[i];
        //         files.push(file);
        //         Log.Info("Building " + file);
        //         this.resolveFile(file, process.cwd(), "bundle");
        //     }
        // }
        // this.sendToWorker("findDependencies", process.argv[2]);
        // resolve("express", { basedir: process.cwd() }, (err, filepath) => {
        //     this.sendToWorker("file", "express", process.cwd(), "test.js");
        // })
    };
    App.prototype.resolveFile = function (FilePath, BaseDirectory, Parent) {
        this.sendToWorker("file", FilePath, BaseDirectory, Parent);
    };
    App.prototype.startWorkers = function () {
        var _this = this;
        var _loop_1 = function () {
            var cp = cluster_1.fork();
            var socket = new socket_1.Socket(cp);
            this_1._done[cp.id] = true;
            socket.on("resolved", this_1.onResolved);
            socket.on("done", function () {
                _this.onDone(cp);
            });
            socket.on("fileContents", this_1.onFileContents);
            socket.on("dependency", this_1.onDependency);
            socket.on("style", this_1.onStyle);
            socket.on("sourcemap", this_1.onSourceMap);
            socket.on("error", function () {
                // console.log("\n\n\n");
                // process.exit(1);
            });
            this_1._sockets.push(socket);
        };
        var this_1 = this;
        for (var i = 0; i < workers; i++) {
            _loop_1();
        }
    };
    App.prototype.sendToWorker = function (Type) {
        var Args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            Args[_i - 1] = arguments[_i];
        }
        var _a;
        if (++this._iterator == workers) {
            this._iterator = 0;
        }
        this._done[this._sockets[this._iterator].socket.id] = false;
        (_a = this._sockets[this._iterator]).send.apply(_a, [Type].concat(Args));
    };
    App.prototype.findDependencies = function (FilePath) {
        this.sendToWorker("findDependencies", FilePath);
    };
    return App;
}());
exports.App = App;
var yargs_1 = require("yargs");
var app = new App(yargs_1.argv);
var onFinish = debounce(function () { return __awaiter(_this, void 0, void 0, function () {
    var manifest, _i, _a, bundle, res, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                manifest = {};
                _i = 0, _a = app.bundles;
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                bundle = _a[_i];
                return [4 /*yield*/, new Generator_1.Generator(app, bundle).run()];
            case 2:
                res = _b.sent();
                if (app.config.cachebuster) {
                    manifest[res[1]] = res[0];
                    // }
                }
                app.config.cachebuster && fs_1.writeFileSync(app.outDir + "/manifest.json", JSON.stringify(manifest));
                log_1.Log.TimeEnd("Done in % seconds");
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 6];
            case 5:
                e_1 = _b.sent();
                log_1.Log.Error(e_1.message);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); }, 100, false);

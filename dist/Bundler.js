"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_1 = require("./socket");
var log_1 = require("./log");
var resolve = require("resolve");
var builtins_1 = require("./builtins");
var PluginManager_1 = require("./PluginManager");
var Bundler = /** @class */ (function () {
    function Bundler() {
    }
    Bundler.IsDone = function () {
        if (this.Queue == 0) {
            this.SocketInst.send("done");
        }
    };
    Bundler.OnOptions = function (Listener) {
        this.SocketInst.on("options", Listener);
    };
    Bundler.OnPlugin = function (Listener) {
        this.SocketInst.on("plugin", Listener);
    };
    Bundler.SendFileContents = function (FilePath, Contents) {
        this.SocketInst.send("fileContents", FilePath, Contents);
    };
    Bundler.SendDependency = function (Name, ParentFile) {
        this.SocketInst.send("dependency", Name, ParentFile);
    };
    Bundler.SendResolved = function (Name, FilePath, ParentFile) {
        this.SocketInst.send("resolved", Name, FilePath, ParentFile);
    };
    Bundler.SendSourceMap = function (FilePath, SourceFile, SourceMap) {
        this.SocketInst.send("sourcemap", FilePath, SourceFile, SourceMap);
    };
    Bundler.OnFile = function (Callback) {
        this.SocketInst.on("file", Callback);
    };
    Bundler.OnFindDependencies = function (Callback) {
        this.SocketInst.on("findDependencies", Callback);
    };
    Bundler.Error = function (Message) {
        log_1.Log.Error(Message);
        this.SocketInst.send("error");
    };
    Bundler.IncrementQueue = function () {
        this.Queue++;
    };
    Bundler.DecrementQueue = function () {
        this.Queue--;
        this.IsDone();
    };
    Bundler.SendStyle = function (FileName, Contents) {
        this.SocketInst.send("style", FileName, Contents);
    };
    Bundler.Resolve = function (FileName, BaseDirectory, ParentFile) {
        var _this = this;
        this.IncrementQueue();
        resolve(FileName, { basedir: BaseDirectory, extensions: this.Extensions }, function (ResolveError, FilePath) {
            if (ResolveError) {
                log_1.Log.Error("Cannot find module " + FileName + " from " + ParentFile);
                _this.SocketInst.send("error");
            }
            if (FilePath && FilePath[0] == "/") {
                _this.SocketInst.send("resolved", FileName, FilePath, ParentFile);
            }
            else if (resolve.isCore(FileName)) {
                if (builtins_1.BUILT_IN[FilePath]) {
                    _this.SocketInst.send("resolved", FileName, builtins_1.BUILT_IN[FilePath], ParentFile);
                }
                else {
                    log_1.Log.Error("Cannot find module " + FileName + " from " + ParentFile);
                    _this.SocketInst.send("error");
                }
            }
            _this.DecrementQueue();
        });
    };
    Bundler.FindDependencies = function (FileName) {
        var _this = this;
        var resolver = this.Resolvers.find(function (Resolver) {
            return Resolver.isFor(FileName);
        });
        if (!resolver) {
            this.Error("Cannot find module " + FileName);
        }
        else {
            resolver.crawl(FileName, function () {
                _this.IsDone();
            });
        }
    };
    Bundler.Queue = 0;
    Bundler.SocketInst = new socket_1.Socket();
    Bundler.Resolvers = [];
    Bundler.Extensions = [];
    return Bundler;
}());
exports.Bundler = Bundler;
Bundler.OnPlugin(function (Name) {
    var _a, _b;
    var plugin = PluginManager_1.PluginManager.LoadPluginWorker(Name);
    (_a = Bundler.Extensions).push.apply(_a, plugin.Extensions);
    (_b = Bundler.Resolvers).push.apply(_b, (plugin.Resolvers.map(function (Resolver) { return new Resolver(); })));
});
Bundler.OnFile(function (FileName, BaseDirectory, ParentFile) {
    Bundler.Resolve(FileName, BaseDirectory, ParentFile);
});
Bundler.OnOptions(function (Opts) {
    // Options.Set(Opts);
});
Bundler.OnFindDependencies(function (FileName) {
    Bundler.FindDependencies(FileName);
});

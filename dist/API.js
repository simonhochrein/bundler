"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_1 = require("./socket");
var log_1 = require("./log");
var resolve = require("resolve");
var builtins_1 = require("./builtins");
var javascript_1 = require("./resolvers/javascript");
var typescript_1 = require("./resolvers/typescript");
var json_1 = require("./resolvers/json");
var scss_1 = require("./resolvers/scss");
var ejs_1 = require("./resolvers/ejs");
var image_1 = require("./resolvers/image");
var css_1 = require("./resolvers/css");
var Bundler = /** @class */ (function () {
    function Bundler() {
    }
    Bundler.IsDone = function () {
        if (this.Queue == 0) {
            this.SocketInst.send("done");
        }
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
        resolve(FileName, { basedir: BaseDirectory, extensions: [".js", ".ts", ".tsx", ".scss", ".ejs"] }, function (ResolveError, FilePath, Package) {
            if (ResolveError) {
                log_1.Log.Error("Cannot find module " + FileName + " from " + ParentFile);
                _this.SocketInst.send("error");
                return;
            }
            if (FilePath && FilePath[0] == "/") {
                _this.SocketInst.send("resolved", FileName, FilePath, ParentFile);
            }
            else if (FilePath[0] != "/" && builtins_1.BUILT_IN[FilePath]) {
                _this.SocketInst.send("resolved", FileName, builtins_1.BUILT_IN[FilePath], ParentFile);
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
    Bundler.Resolvers = [new javascript_1.JSResolver, new css_1.CSSResolver, new typescript_1.TSResolver, new json_1.JSONResolver, new scss_1.SCSSResolver, new ejs_1.EJSResolver, new image_1.ImageResolver];
    return Bundler;
}());
exports.Bundler = Bundler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var ejs_1 = require("ejs");
var Bundler_1 = require("../../Bundler");
var EJSResolver = /** @class */ (function () {
    function EJSResolver() {
    }
    EJSResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".ejs";
    };
    EJSResolver.prototype.crawl = function (FilePath, Done) {
        var compiled = ejs_1.compile(fs_1.readFileSync(FilePath, "utf8"), { client: true, filename: FilePath, root: process.cwd() });
        Bundler_1.Bundler.SendFileContents(FilePath, compiled.toString() + "\nmodule.exports = anonymous");
        Done();
    };
    return EJSResolver;
}());
exports.EJSResolver = EJSResolver;

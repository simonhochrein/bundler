"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var Bundler_1 = require("../../Bundler");
var JSONResolver = /** @class */ (function () {
    function JSONResolver() {
    }
    JSONResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".json";
    };
    JSONResolver.prototype.crawl = function (FilePath, Done) {
        Bundler_1.Bundler.SendFileContents(FilePath, "module.exports = " + fs_1.readFileSync(FilePath, "utf8"));
        Done();
    };
    return JSONResolver;
}());
exports.JSONResolver = JSONResolver;

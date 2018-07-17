"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var Bundler_1 = require("../../Bundler");
var FileSystem = require("fs");
var CSSResolver = /** @class */ (function () {
    function CSSResolver() {
    }
    CSSResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".css";
    };
    CSSResolver.prototype.crawl = function (FilePath, Done) {
        Bundler_1.Bundler.SendFileContents(FilePath, "var s = document.createElement(\"style\");s.appendChild(document.createTextNode(\"" + FileSystem.readFileSync(FilePath, "utf8").replace(/"/g, "\\\"").replace(/\n/g, "\\n") + "\"));document.head.appendChild(s);");
        Done();
    };
    return CSSResolver;
}());
exports.CSSResolver = CSSResolver;

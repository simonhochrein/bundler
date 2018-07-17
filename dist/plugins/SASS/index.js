"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var sass = require("node-sass");
var Bundler_1 = require("../../Bundler");
var Options_1 = require("../../Options");
var SCSSResolver = /** @class */ (function () {
    function SCSSResolver() {
    }
    SCSSResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".scss";
    };
    SCSSResolver.prototype.crawl = function (FilePath, Done) {
        sass.render({
            file: FilePath,
            sourceMapEmbed: Options_1.Options.Get("SASS.SourceMap"),
            sourceMapContents: true,
            outFile: "bundle.js"
        }, function (SassError, Result) {
            SassError && console.log(SassError);
            // console.log(result.map.toString());
            // Bundler.SendStyle(FilePath, Result.css.toString());
            Bundler_1.Bundler.SendFileContents(FilePath, "var s = document.createElement(\"style\");s.appendChild(document.createTextNode(" + JSON.stringify(Result.css.toString()) + "));document.head.appendChild(s);");
            Done();
        });
    };
    return SCSSResolver;
}());
exports.SCSSResolver = SCSSResolver;

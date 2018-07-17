"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var acorn_1 = require("acorn");
var Bundler_1 = require("../../Bundler");
var walk = require("acorn/dist/walk");
var JSResolver = /** @class */ (function () {
    function JSResolver() {
    }
    JSResolver.prototype.isFor = function (FileName) {
        return path_1.extname(FileName) == ".js";
    };
    JSResolver.prototype.crawl = function (FilePath, Done) {
        var file = fs_1.readFileSync(FilePath, "utf8");
        // transform(file, {}, (err, res) => {
        //     onFileContents(filepath, res.code);
        Bundler_1.Bundler.SendFileContents(FilePath, file);
        try {
            walk.simple(acorn_1.parse(file), {
                CallExpression: function (RequireNode) {
                    if (RequireNode.callee.name == "require") {
                        if (RequireNode.arguments[0] && RequireNode.arguments[0].value) {
                            Bundler_1.Bundler.SendDependency(RequireNode.arguments[0].value, FilePath);
                        }
                    }
                }
            });
        }
        catch (e) {
            console.log(e, FilePath);
        }
        Done();
        // });
    };
    return JSResolver;
}());
exports.JSResolver = JSResolver;

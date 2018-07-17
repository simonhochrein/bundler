"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var FileSystem = require("fs");
var acorn_1 = require("acorn");
var TypeScript = require("typescript");
var Bundler_1 = require("../../Bundler");
var walk = require("acorn/dist/walk");
var TSResolver = /** @class */ (function () {
    function TSResolver() {
    }
    TSResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".ts" || path_1.extname(FilePath) == ".tsx";
    };
    TSResolver.prototype.crawl = function (FilePath, Done) {
        var file = FileSystem.readFileSync(FilePath, "utf8");
        var result = TypeScript.transpileModule(file, {
            fileName: FilePath,
            compilerOptions: {
                jsx: TypeScript.JsxEmit.React,
                target: TypeScript.ScriptTarget.ES5,
                allowSyntheticDefaultImports: true,
                sourceMap: true
            }
        });
        // transform(file, {}, (err, res) => {
        //     onFileContents(filepath, res.code);
        Bundler_1.Bundler.SendFileContents(FilePath, result.outputText);
        Bundler_1.Bundler.SendSourceMap(FilePath, file, result.sourceMapText);
        try {
            walk.simple(acorn_1.parse(result.outputText), {
                CallExpression: function (RequireCall) {
                    if (RequireCall.callee.name == "require") {
                        if (RequireCall.arguments[0] && RequireCall.arguments[0].value) {
                            Bundler_1.Bundler.SendDependency(RequireCall.arguments[0].value, FilePath);
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
    return TSResolver;
}());
exports.TSResolver = TSResolver;

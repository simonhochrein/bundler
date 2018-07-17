"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var resolver_1 = require("../../resolver");
var path_1 = require("path");
var fs_1 = require("fs");
var Bundler_1 = require("../../Bundler");
var JSONResolver = /** @class */ (function (_super) {
    __extends(JSONResolver, _super);
    function JSONResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".json";
    };
    JSONResolver.prototype.crawl = function (FilePath, Done) {
        Bundler_1.Bundler.SendFileContents(FilePath, "module.exports = " + fs_1.readFileSync(FilePath, "utf8"));
        Done();
    };
    return JSONResolver;
}(resolver_1.AbstractResolver));
exports.JSONResolver = JSONResolver;

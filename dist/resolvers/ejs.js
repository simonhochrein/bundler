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
var resolver_1 = require("./resolver");
var path_1 = require("path");
var fs_1 = require("fs");
var ejs_1 = require("ejs");
var API_1 = require("../API");
var EJSResolver = /** @class */ (function (_super) {
    __extends(EJSResolver, _super);
    function EJSResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EJSResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".ejs";
    };
    EJSResolver.prototype.crawl = function (FilePath, Done) {
        var compiled = ejs_1.compile(fs_1.readFileSync(FilePath, "utf8"), { client: true, filename: FilePath, root: process.cwd() });
        API_1.Bundler.SendFileContents(FilePath, compiled.toString() + "\nmodule.exports = anonymous");
        Done();
    };
    return EJSResolver;
}(resolver_1.AbstractResolver));
exports.EJSResolver = EJSResolver;

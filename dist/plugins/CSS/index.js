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
var resolver_1 = require("../../resolvers/resolver");
var path_1 = require("path");
var Bundler_1 = require("../../Bundler");
var FileSystem = require("fs");
var CSSResolver = /** @class */ (function (_super) {
    __extends(CSSResolver, _super);
    function CSSResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CSSResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".css";
    };
    CSSResolver.prototype.crawl = function (FilePath, Done) {
        Bundler_1.Bundler.SendFileContents(FilePath, "var s = document.createElement(\"style\");s.appendChild(document.createTextNode(\"" + FileSystem.readFileSync(FilePath, "utf8").replace(/"/g, "\\\"").replace(/\n/g, "\\n") + "\"));document.head.appendChild(s);");
        Done();
    };
    return CSSResolver;
}(resolver_1.AbstractResolver));
exports.CSSResolver = CSSResolver;

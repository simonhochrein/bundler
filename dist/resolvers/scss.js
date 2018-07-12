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
var sass = require("node-sass");
var API_1 = require("../API");
var SCSSResolver = /** @class */ (function (_super) {
    __extends(SCSSResolver, _super);
    function SCSSResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SCSSResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".scss";
    };
    SCSSResolver.prototype.crawl = function (FilePath, Done) {
        sass.render({
            file: FilePath,
        }, function (SassError, Result) {
            SassError && console.log(SassError);
            // console.log(result.map.toString());
            // Bundler.SendStyle(FilePath, Result.css.toString());
            API_1.Bundler.SendFileContents(FilePath, "var s = document.createElement(\"style\");s.appendChild(document.createTextNode(\"" + Result.css.toString().replace(/"/g, "\\\"").replace(/\n/g, "\\n") + "\"));document.head.appendChild(s);");
            Done();
        });
    };
    return SCSSResolver;
}(resolver_1.AbstractResolver));
exports.SCSSResolver = SCSSResolver;

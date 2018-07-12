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
var API_1 = require("../API");
var ImageResolver = /** @class */ (function (_super) {
    __extends(ImageResolver, _super);
    function ImageResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageResolver.prototype.isFor = function (FilePath) {
        return path_1.extname(FilePath) == ".png";
    };
    ImageResolver.prototype.crawl = function (FilePath, Done) {
        API_1.Bundler.SendFileContents(FilePath, "module.exports = 'data:image/png;base64," + fs_1.readFileSync(FilePath).toString("base64") + "';");
        Done();
    };
    return ImageResolver;
}(resolver_1.AbstractResolver));
exports.ImageResolver = ImageResolver;

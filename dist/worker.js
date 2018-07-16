"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bundler_1 = require("./Bundler");
var Options_1 = require("./Options");
Bundler_1.Bundler.OnFile(function (FileName, BaseDirectory, ParentFile) {
    Bundler_1.Bundler.Resolve(FileName, BaseDirectory, ParentFile);
});
Bundler_1.Bundler.OnOptions(function (Opts) {
    Options_1.Options.Set(Opts);
});
Bundler_1.Bundler.OnFindDependencies(function (FileName) {
    Bundler_1.Bundler.FindDependencies(FileName);
});

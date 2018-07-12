"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var API_1 = require("./API");
API_1.Bundler.OnFile(function (FileName, BaseDirectory, ParentFile) {
    API_1.Bundler.Resolve(FileName, BaseDirectory, ParentFile);
});
API_1.Bundler.OnFindDependencies(function (FileName) {
    API_1.Bundler.FindDependencies(FileName);
});

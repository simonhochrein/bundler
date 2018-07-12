import { Bundler } from "./API";

Bundler.OnFile(function (FileName, BaseDirectory, ParentFile) {
    Bundler.Resolve(FileName, BaseDirectory, ParentFile);
});

Bundler.OnFindDependencies(function (FileName) {
    Bundler.FindDependencies(FileName);
});
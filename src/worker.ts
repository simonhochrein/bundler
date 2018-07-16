import { Bundler } from "./Bundler";
import { Options } from "./Options";

Bundler.OnFile(function (FileName, BaseDirectory, ParentFile) {
    Bundler.Resolve(FileName, BaseDirectory, ParentFile);
});

Bundler.OnOptions((Opts) => {
    Options.Set(Opts);
});

Bundler.OnFindDependencies(function (FileName) {
    Bundler.FindDependencies(FileName);
});
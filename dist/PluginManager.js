"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PluginManager = /** @class */ (function () {
    function PluginManager() {
    }
    PluginManager.LoadPlugin = function (Name) {
        var plugin = this.LoadPluginWorker(Name);
        this.Listeners.forEach(function (Cb) { return Cb(Name); });
    };
    PluginManager.LoadPluginWorker = function (Name) {
        try {
            require.resolve(process.cwd() + "/.bundler/plugins/" + Name + "/plugin");
        }
        catch (e) {
            return require("./plugins/" + Name + "/plugin");
        }
        return require(process.cwd() + "/.bundler/plugins/" + Name + "/plugin");
    };
    PluginManager.OnAddPlugin = function (Callback) {
        this.Listeners.push(Callback);
    };
    PluginManager.Listeners = [];
    return PluginManager;
}());
exports.PluginManager = PluginManager;

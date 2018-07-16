import { Options } from "./Options";

export class PluginManager {
    static Listeners = [];

    static LoadPlugin(Name) {
        var plugin = this.LoadPluginWorker(Name);
        Options.AddOptions(plugin.Options);
        this.Listeners.forEach((Cb) => Cb(Name));
    }
    static LoadPluginWorker(Name) {
        return require("./plugins/" + Name + "/plugin");
    }
    static OnAddPlugin(Callback) {
        this.Listeners.push(Callback);
    }
}
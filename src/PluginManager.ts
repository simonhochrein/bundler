import { Options } from "./Options";
import { join } from "path";
import { Log } from "./log";

export class PluginManager {
    static Listeners = [];

    static LoadPlugin(Name) {
        var plugin = this.LoadPluginWorker(Name);
        Options.AddOptions(plugin.Options);
        this.Listeners.forEach((Cb) => Cb(Name));
    }
    static LoadPluginWorker(Name) {
        try {
            require.resolve(process.cwd() + "/.bundler/plugins/" + Name + "/plugin");
        } catch (e) {
            return require("./plugins/" + Name + "/plugin");
        }
        return require(process.cwd() + "/.bundler/plugins/" + Name + "/plugin");
    }
    static OnAddPlugin(Callback) {
        this.Listeners.push(Callback);
    }
}
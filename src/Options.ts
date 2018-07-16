import { IOption, IOptionType } from "./Types";

import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { EventEmitter } from "events";

var options = {

};

var schemas: IOption[] = [
    {
        ID: "Bundler.CacheBuster",
        Default: false,
        Name: "Cache Busting",
        Type: IOptionType.Boolean
    }
];
var listeners = [];

export class Options {
    static Set(Opts);
    static Set(Name: string, Value: any);
    static Set(Arg1, Arg2?) {
        if (Arg2 != null) {
            switch (schemas.find(({ ID }) => Arg1 == ID).Type) {
                case IOptionType.Boolean:
                    options[Arg1] = (Arg2 == "true");
                    break;
                case IOptionType.Number:
                    options[Arg1] = parseInt(Arg2);
                    break;
                case IOptionType.String:
                    options[Arg1] = Arg2;
                    break;
            }
            listeners.forEach(Fn => Fn(options));
        } else {
            options = Arg1;
        }
    }

    static OnChange(Callback) {
        listeners.push(Callback);
    }
    static Get();
    static Get(Name: string);
    static Get(Name?: string) {
        if (Name) {
            return options[Name];
        } else {
            return options;
        }
    }

    static GetOptions() {
        return schemas.map(Schema => {
            return Object.assign(Schema, { Value: options[Schema.ID] });
        });
    }

    static AddOptions(Opts: IOption[]) {
        Opts.forEach(Option => {
            options[Option.ID] ? null : options[Option.ID] = Option.Default;
            schemas.push(Option);
        });
    }

    static Load() {
        if (existsSync(join(process.cwd(), "bundler.json"))) {
            options = require(join(process.cwd(), "bundler.json"));
        }
    }

    static Save() {
        writeFileSync(join(process.cwd(), "bundler.json"), JSON.stringify(options));
    }
}
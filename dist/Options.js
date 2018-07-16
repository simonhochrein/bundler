"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("./Types");
var fs_1 = require("fs");
var path_1 = require("path");
var options = {};
var schemas = [
    {
        ID: "Bundler.CacheBuster",
        Default: false,
        Name: "Cache Busting",
        Type: Types_1.IOptionType.Boolean
    }
];
var listeners = [];
var Options = /** @class */ (function () {
    function Options() {
    }
    Options.Set = function (Arg1, Arg2) {
        if (Arg2 != null) {
            switch (schemas.find(function (_a) {
                var ID = _a.ID;
                return Arg1 == ID;
            }).Type) {
                case Types_1.IOptionType.Boolean:
                    options[Arg1] = (Arg2 == "true");
                    break;
                case Types_1.IOptionType.Number:
                    options[Arg1] = parseInt(Arg2);
                    break;
                case Types_1.IOptionType.String:
                    options[Arg1] = Arg2;
                    break;
            }
            listeners.forEach(function (Fn) { return Fn(options); });
        }
        else {
            options = Arg1;
        }
    };
    Options.OnChange = function (Callback) {
        listeners.push(Callback);
    };
    Options.Get = function (Name) {
        if (Name) {
            return options[Name];
        }
        else {
            return options;
        }
    };
    Options.GetOptions = function () {
        return schemas.map(function (Schema) {
            return Object.assign(Schema, { Value: options[Schema.ID] });
        });
    };
    Options.AddOptions = function (Opts) {
        Opts.forEach(function (Option) {
            options[Option.ID] ? null : options[Option.ID] = Option.Default;
            schemas.push(Option);
        });
    };
    Options.Load = function () {
        if (fs_1.existsSync(path_1.join(process.cwd(), "bundler.json"))) {
            options = require(path_1.join(process.cwd(), "bundler.json"));
        }
    };
    Options.Save = function () {
        fs_1.writeFileSync(path_1.join(process.cwd(), "bundler.json"), JSON.stringify(options));
    };
    return Options;
}());
exports.Options = Options;

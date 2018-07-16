"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../../Types");
var _1 = require(".");
module.exports = {
    "Name": "SASS",
    "Extensions": [".scss"],
    "Resolvers": [_1.SCSSResolver],
    "Options": [
        {
            "ID": "SASS.SourceMap",
            "Type": Types_1.IOptionType.Boolean,
            "Name": "Source Maps",
            "Default": true
        }
    ]
};

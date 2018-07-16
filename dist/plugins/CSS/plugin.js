"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../../Types");
var _1 = require(".");
module.exports = {
    "Name": "CSS",
    "Extensions": [".css"],
    "Resolvers": [_1.CSSResolver],
    "Options": [
        {
            "ID": "JavaScript.test",
            "Type": Types_1.IOptionType.String,
            "Name": "Test",
            "Default": "hi"
        }
    ]
};

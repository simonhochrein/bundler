import { IOptionType } from "../../Types";
import { SCSSResolver } from ".";

module.exports = {
    "Name": "SASS",
    "Extensions": [".scss"],
    "Resolvers": [SCSSResolver],
    "Options": [
        {
            "ID": "SASS.SourceMap",
            "Type": IOptionType.Boolean,
            "Name": "Source Maps",
            "Default": true
        }
    ]
};
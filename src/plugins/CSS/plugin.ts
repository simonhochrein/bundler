import { IOptionType } from "../../Types";
import { CSSResolver } from ".";

module.exports = {
    "Name": "CSS",
    "Extensions": [".css"],
    "Resolvers": [CSSResolver],
    "Options": [
        {
            "ID": "JavaScript.test",
            "Type": IOptionType.String,
            "Name": "Test",
            "Default": "hi"
        }
    ]
};
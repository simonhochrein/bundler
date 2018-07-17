import { IResolver } from "../../resolver";
import { extname } from "path";
import * as sass from "node-sass";
import { Bundler } from "../../Bundler";
import { Options } from "../../Options";

export class SCSSResolver implements IResolver {
    isFor(FilePath: string): boolean {
        return extname(FilePath) == ".scss";
    }
    crawl(FilePath: string, Done: () => void): void {
        sass.render({
            file: FilePath,
            sourceMapEmbed: Options.Get("SASS.SourceMap"),
            sourceMapContents: true,
            outFile: "bundle.js"
        }, function (SassError, Result) {
            SassError && console.log(SassError);
            // console.log(result.map.toString());
            // Bundler.SendStyle(FilePath, Result.css.toString());
            Bundler.SendFileContents(FilePath, `var s = document.createElement("style");s.appendChild(document.createTextNode(${JSON.stringify(Result.css.toString())}));document.head.appendChild(s);`);
            Done();
        });
    }
}
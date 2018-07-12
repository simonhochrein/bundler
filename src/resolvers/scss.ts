import { AbstractResolver } from "./resolver";
import { extname } from "path";
import * as sass from "node-sass";
import { Bundler } from "../API";

export class SCSSResolver extends AbstractResolver {
    isFor(FilePath: string): boolean {
        return extname(FilePath) == ".scss";
    }
    crawl(FilePath: string, Done: () => void): void {
        sass.render({
            file: FilePath,
            // sourceMap: true,
            // outFile: 'bundle.js'
        }, function (SassError, Result) {
            SassError && console.log(SassError);
            // console.log(result.map.toString());
            // Bundler.SendStyle(FilePath, Result.css.toString());
            Bundler.SendFileContents(FilePath, `var s = document.createElement("style");s.appendChild(document.createTextNode("${Result.css.toString().replace(/"/g, "\\\"").replace(/\n/g, "\\n")}"));document.head.appendChild(s);`);
            Done();
        });
    }
}
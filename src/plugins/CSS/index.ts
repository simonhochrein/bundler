import { AbstractResolver } from "../../resolvers/resolver";
import { extname } from "path";
import { Bundler } from "../../Bundler";
import * as FileSystem from "fs";

export class CSSResolver extends AbstractResolver {
    isFor(FilePath: string): boolean {
        return extname(FilePath) == ".css";
    }
    crawl(FilePath: string, Done: () => void): void {
        Bundler.SendFileContents(FilePath, `var s = document.createElement("style");s.appendChild(document.createTextNode("${FileSystem.readFileSync(FilePath, "utf8").replace(/"/g, "\\\"").replace(/\n/g, "\\n")}"));document.head.appendChild(s);`);
        Done();
    }
}
import { AbstractResolver } from "../../resolver";
import { extname } from "path";
import { readFileSync } from "fs";
import { Bundler } from "../../Bundler";

export class JSONResolver extends AbstractResolver {
    isFor(FilePath: string): boolean {
        return extname(FilePath) == ".json";
    }
    crawl(FilePath: string, Done: () => void): void {
        Bundler.SendFileContents(FilePath, `module.exports = ` + readFileSync(FilePath, "utf8"));
        Done();
    }
}
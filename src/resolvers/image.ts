import { AbstractResolver } from "./resolver";
import { extname } from "path";
import { readFileSync } from "fs";
import { Bundler } from "../API";

export class ImageResolver extends AbstractResolver {
    isFor(FilePath: string): boolean {
        return extname(FilePath) == ".png";
    }
    crawl(FilePath: string, Done: () => void): void {
        Bundler.SendFileContents(FilePath, "module.exports = 'data:image/png;base64," + readFileSync(FilePath).toString("base64") + "';");
        Done();
    }
}
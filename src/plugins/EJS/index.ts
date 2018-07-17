import { IResolver } from "../../resolver";
import { extname } from "path";
import { readFileSync } from "fs";
import { compile } from "ejs";
import { Bundler } from "../../Bundler";

export class EJSResolver implements IResolver {
    isFor(FilePath: string): boolean {
        return extname(FilePath) == ".ejs";
    }
    crawl(FilePath: string, Done: () => void): void {
        let compiled = compile(readFileSync(FilePath, "utf8"), { client: true, filename: FilePath, root: process.cwd() });
        Bundler.SendFileContents(FilePath, compiled.toString() + "\nmodule.exports = anonymous");
        Done();
    }
}
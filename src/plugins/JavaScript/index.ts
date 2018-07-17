import { extname } from "path";
import { readFileSync } from "fs";
import { parse } from "acorn";
import { AbstractResolver } from "../../resolver";
import { Bundler } from "../../Bundler";


let walk = require("acorn/dist/walk");

export class JSResolver extends AbstractResolver {
    isFor(FileName: string): boolean {
        return extname(FileName) == ".js";
    }
    crawl(FilePath: string, Done: () => void): void {
        var file = readFileSync(FilePath, "utf8");
        // transform(file, {}, (err, res) => {
        //     onFileContents(filepath, res.code);
        Bundler.SendFileContents(FilePath, file);
        try {
            walk.simple(parse(file), {
                CallExpression: (RequireNode) => {
                    if ((RequireNode.callee as any).name == "require") {
                        if (RequireNode.arguments[0] && RequireNode.arguments[0].value) {
                            Bundler.SendDependency(RequireNode.arguments[0].value, FilePath);
                        }
                    }
                }
            });
        } catch (e) {
            console.log(e, FilePath);
        }
        Done();
        // });
    }
}
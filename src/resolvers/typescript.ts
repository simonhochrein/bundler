import { extname } from "path";
import * as FileSystem from "fs";
import { parse } from "acorn";
import { AbstractResolver } from "./resolver";
import * as TypeScript from "typescript";
import { Bundler } from "../API";


let walk = require("acorn/dist/walk");

export class TSResolver extends AbstractResolver {
    isFor(FilePath: string): boolean {
        return extname(FilePath) == ".ts" || extname(FilePath) == ".tsx";
    }
    crawl(FilePath: string, Done: () => void): void {
        var file = FileSystem.readFileSync(FilePath, "utf8");
        let result = TypeScript.transpileModule(file, {
            fileName: FilePath,
            compilerOptions: {
                jsx: TypeScript.JsxEmit.React,
                target: TypeScript.ScriptTarget.ES5,
                allowSyntheticDefaultImports: true,
                sourceMap: true
            }
        });
        // transform(file, {}, (err, res) => {
        //     onFileContents(filepath, res.code);
        Bundler.SendFileContents(FilePath, result.outputText);
        Bundler.SendSourceMap(FilePath, file, result.sourceMapText);
        try {
            walk.simple(parse(result.outputText), {
                CallExpression: (RequireCall: any) => {
                    if (RequireCall.callee.name == "require") {
                        if (RequireCall.arguments[0] && RequireCall.arguments[0].value) {
                            Bundler.SendDependency(RequireCall.arguments[0].value, FilePath);
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
import { Socket } from "./socket";
import { Log } from "./log";
import * as resolve from "resolve";
import { BUILT_IN } from "./builtins";
import { JSResolver } from "./resolvers/javascript";
import { TSResolver } from "./resolvers/typescript";
import { JSONResolver } from "./resolvers/json";
import { SCSSResolver } from "./resolvers/scss";
import { EJSResolver } from "./resolvers/ejs";
import { ImageResolver } from "./resolvers/image";

export class Bundler {
    static Queue = 0;
    static SocketInst = new Socket();
    static Resolvers = [new JSResolver, new TSResolver, new JSONResolver, new SCSSResolver, new EJSResolver, new ImageResolver];

    static IsDone() {
        if (this.Queue == 0) {
            this.SocketInst.send("done");
        }
    }
    static SendFileContents(FilePath, Contents) {
        this.SocketInst.send("fileContents", FilePath, Contents);
    }
    static SendDependency(Name, ParentFile) {
        this.SocketInst.send("dependency", Name, ParentFile);
    }
    static SendResolved(Name: string, FilePath: string, ParentFile: string) {
        this.SocketInst.send("resolved", Name, FilePath, ParentFile);
    }
    static SendSourceMap(FilePath: string, SourceFile: string, SourceMap: string) {
        this.SocketInst.send("sourcemap", FilePath, SourceFile, SourceMap);
    }
    static OnFile(Callback: (Name: string, BaseDirectory: string, ParentFile: string) => void) {
        this.SocketInst.on("file", Callback);
    }
    static OnFindDependencies(Callback: (FilePath: string) => void) {
        this.SocketInst.on("findDependencies", Callback);
    }
    static Error(Message: string) {
        Log.Error(Message);
        this.SocketInst.send("error");
    }
    static IncrementQueue() {
        this.Queue++;
    }
    static DecrementQueue() {
        this.Queue--;
        this.IsDone();
    }
    static SendStyle(FileName: string, Contents: string) {
        this.SocketInst.send("style", FileName, Contents);
    }
    static Resolve(FileName: string, BaseDirectory: string, ParentFile: string) {
        this.IncrementQueue();
        resolve(FileName, { basedir: BaseDirectory, extensions: [".js", ".ts", ".tsx", ".scss", ".ejs"] }, (ResolveError, FilePath, Package) => {
            if (ResolveError) {
                Log.Error(`Cannot find module ${FileName} from ${ParentFile}`);
                this.SocketInst.send("error");
                return;
            }
            if (FilePath && FilePath[0] == "/") {
                this.SocketInst.send("resolved", FileName, FilePath, ParentFile);
            } else if (FilePath[0] != "/" && BUILT_IN[FilePath]) {
                this.SocketInst.send("resolved", FileName, BUILT_IN[FilePath], ParentFile);
            }
            this.DecrementQueue();
        });
    }
    static FindDependencies(FileName: string) {
        let resolver = this.Resolvers.find((Resolver) => {
            return Resolver.isFor(FileName);
        });

        if (!resolver) {
            this.Error(`Cannot find module ${FileName}`);
        } else {
            resolver.crawl(FileName, () => {
                this.IsDone();
            });
        }
    }
}
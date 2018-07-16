import * as express from "express";
import { join } from "path";
import { Log } from "../log";
import * as ChildProcess from "child_process";
import { Options } from "../Options";
import * as Readline from "readline";

let files = {};
let names = {};

let app = express();

app.get("/options", (Request, Response) => {
    Response.json(Options.GetOptions());
});

app.post("/options/:name/:value", (Request, Response) => {
    Options.Set(Request.params.name, Request.params.value);
    Options.Save();
    Response.json(Options.GetOptions());
});

app.get("/index.js", (Request, Response) => {
    Response.sendFile(join(__dirname, "../../.build/index.bundle.js"));
});

app.get("/", (Request, Response) => {
    Response.sendFile(join(__dirname, "../../dashboard/index.html"));
});

let server = app.listen(8080, () => {
    // Log.Info("Listening on http://localhost:" + server.address()["port"]);
    // ChildProcess.execSync("open http://localhost:" + server.address()["port"]);
});

export function updateData(Files, FileNames) {
    files = Files;
    names = FileNames;
}

Readline.cursorTo(process.stdout, 0, 0);
Readline.clearScreenDown(process.stdout);

export function updateWorkers(Workers) {
    var status = "";
    for (var key in Workers) {
        status += (Workers[key] ? "●".green : "●".red) + " ";
    }
    Readline.cursorTo(process.stdout, 0, 0);
    process.stdout.write(status);
}
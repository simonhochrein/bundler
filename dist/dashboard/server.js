"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path_1 = require("path");
var Readline = require("readline");
var files = {};
var names = {};
var app = express();
app.get("/plugins", function (Request, Response) {
    Response.json({});
});
app.get("/index.js", function (Request, Response) {
    Response.sendFile(path_1.join(__dirname, "../../.bundler/build/index.bundle.js"));
});
app.get("/", function (Request, Response) {
    Response.sendFile(path_1.join(__dirname, "../../dashboard/index.html"));
});
var server = app.listen(8080, function () {
    // Log.Info("Listening on http://localhost:" + server.address()["port"]);
    // ChildProcess.execSync("open http://localhost:" + server.address()["port"]);
});
function updateData(Files, FileNames) {
    files = Files;
    names = FileNames;
}
exports.updateData = updateData;
Readline.cursorTo(process.stdout, 0, 0);
Readline.clearScreenDown(process.stdout);
function updateWorkers(Workers) {
    // var status = "";
    // for (var key in Workers) {
    //     status += (Workers[key] ? "●".green : "●".red) + " ";
    // }
    // Readline.cursorTo(process.stdout, 0, 0);
    // process.stdout.write(status);
}
exports.updateWorkers = updateWorkers;

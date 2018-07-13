"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path_1 = require("path");
var log_1 = require("../log");
var files = {};
var names = {};
var app = express();
app.set("view engine", "ejs");
app.use("/popper.js", function (Request, Response) {
    Response.sendFile(path_1.join(__dirname, "../../node_modules/popper.js/dist/umd/popper.min.js"));
});
app.use("/chart.js", function (Request, Response) {
    Response.sendFile(path_1.join(__dirname, "../../node_modules/chart.js/dist/Chart.bundle.min.js"));
});
app.use("/jquery.min.js", function (Request, Response) {
    Response.sendFile(path_1.join(__dirname, "../../node_modules/jquery/dist/jquery.min.js"));
});
app.use("/bootstrap", express.static(path_1.join(__dirname, "../../node_modules/bootstrap/dist")));
app.get("/index.bundle.js", function (Request, Response) {
    Response.sendFile(path_1.join(__dirname, "../../dashboard/index.bundle.js"));
});
app.get("/", function (Request, Response) {
    Response.sendFile(path_1.join(__dirname, "../../dashboard/index.html"));
});
var server = app.listen(8080, function () {
    log_1.Log.Info("Listening on http://localhost:" + server.address()["port"]);
});
function updateData(Files, FileNames) {
    files = Files;
    names = FileNames;
}
exports.updateData = updateData;

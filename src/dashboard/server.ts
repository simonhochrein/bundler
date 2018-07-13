import * as express from "express";
import { join } from "path";
import { Log } from "../log";
import * as ChildProcess from "child_process";
import * as Manifest from "../../dashboard/.build/manifest.json";

let files = {};
let names = {};

let app = express();
app.set("view engine", "ejs");

app.use("/popper.js", (Request, Response) => {
    Response.sendFile(join(__dirname, "../../node_modules/popper.js/dist/umd/popper.min.js"));
});

app.use("/chart.js", (Request, Response) => {
    Response.sendFile(join(__dirname, "../../node_modules/chart.js/dist/Chart.bundle.min.js"));
});

app.use("/jquery.min.js", (Request, Response) => {
    Response.sendFile(join(__dirname, "../../node_modules/jquery/dist/jquery.min.js"));
});

app.use("/bootstrap", express.static(join(__dirname, "../../node_modules/bootstrap/dist")));

app.get("/index.js", (Request, Response) => {
    Response.sendFile(join(__dirname, join("../../dashboard/.build", Manifest["index"])));
});

app.get("/", (Request, Response) => {
    Response.sendFile(join(__dirname, "../../dashboard/index.html"));
});

let server = app.listen(8080, () => {
    Log.Info("Listening on http://localhost:" + server.address()["port"]);
    ChildProcess.execSync("open http://localhost:" + server.address()["port"]);
});

export function updateData(Files, FileNames) {
    files = Files;
    names = FileNames;
}
import * as express from "express";
import { join } from "path";
import { Log } from "../log";
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

app.get("/index.bundle.js", (Request, Response) => {
    Response.sendFile(join(__dirname, "../../dashboard/index.bundle.js"));
});

app.get("/", (Request, Response) => {
    Response.sendFile(join(__dirname, "../../dashboard/index.html"));
});

let server = app.listen(8080, () => {
    Log.Info("Listening on http://localhost:" + server.address()["port"]);
});

export function updateData(Files, FileNames) {
    files = Files;
    names = FileNames;
}
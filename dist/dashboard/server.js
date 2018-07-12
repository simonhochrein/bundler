"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path_1 = require("path");
var files = {};
var names = {};
var app = express();
app.set('view engine', 'ejs');
app.use('/popper.js', function (req, res) {
    res.sendFile(path_1.join(__dirname, '../../node_modules/popper.js/dist/umd/popper.min.js'));
});
app.use('/chart.js', function (req, res) {
    res.sendFile(path_1.join(__dirname, '../../node_modules/chart.js/dist/Chart.bundle.min.js'));
});
app.use('/jquery.min.js', function (req, res) {
    res.sendFile(path_1.join(__dirname, '../../node_modules/jquery/dist/jquery.min.js'));
});
app.use('/bootstrap', express.static(path_1.join(__dirname, '../../node_modules/bootstrap/dist')));
app.get('/', function (req, res) {
    res.render("index", { files: files, names: names });
});
app.listen(8080);
function updateData(f, fileNames) {
    files = f;
    names = fileNames;
}
exports.updateData = updateData;

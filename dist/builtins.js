"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Path = require("path");
exports.BUILT_IN = {
    "url": Path.resolve("./node_modules/url/url.js"),
    "path": Path.resolve("./node_modules/path-browserify/index.js"),
    "events": Path.resolve("./node_modules/events/index.js"),
    "util": Path.resolve("./node_modules/util/index.js"),
    "crypto": Path.resolve("./node_modules/crypto-browserify/index.js"),
    "stream": Path.resolve("./node_modules/stream-browserify/index.js"),
    "vm": Path.resolve("./node_modules/vm-browserify/index.js"),
};

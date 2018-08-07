#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cluster_1 = require("cluster");
if (cluster_1.isMaster) {
    require("./Master");
}
else {
    require("./Bundler");
}

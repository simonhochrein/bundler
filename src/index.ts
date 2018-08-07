#!/usr/bin/env node
import { isMaster } from "cluster";

if (isMaster) {
    require("./Master");
} else {
    require("./Bundler");
}
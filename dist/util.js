"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Path = require("path");
var FileSystem = require("fs");
function ensureDirectoryExistence(FilePath) {
    if (!FileSystem.existsSync(FilePath)) {
        if (!FileSystem.existsSync(Path.dirname(FilePath))) {
            ensureDirectoryExistence(Path.dirname(FilePath));
        }
        FileSystem.mkdirSync(FilePath);
    }
}
exports.ensureDirectoryExistence = ensureDirectoryExistence;
function ensureDirectory(FilePath) {
    ensureDirectoryExistence(Path.dirname(FilePath));
}
exports.ensureDirectory = ensureDirectory;

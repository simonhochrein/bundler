"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Path = require("path");
var FileSystem = require("fs");
function ensureDirectoryExistence(FilePath) {
    var dirname = Path.dirname(FilePath);
    if (FileSystem.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    FileSystem.mkdirSync(dirname);
}
exports.ensureDirectoryExistence = ensureDirectoryExistence;
function ensureDirectory(DirectoryPath) {
    if (FileSystem.existsSync(DirectoryPath)) {
        return true;
    }
    ensureDirectoryExistence(Path.dirname(DirectoryPath));
    FileSystem.mkdirSync(DirectoryPath);
}
exports.ensureDirectory = ensureDirectory;

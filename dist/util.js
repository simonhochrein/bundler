"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Path = require("path");
var FileSystem = require("fs");
function ensureDirectoryExistence(FilePath) {
    if (!FileSystem.existsSync(FilePath)) {
        if (FileSystem.existsSync(Path.dirname(FilePath))) {
            FileSystem.mkdirSync(FilePath);
        }
        else {
            ensureDirectoryExistence(Path.dirname(FilePath));
        }
    }
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

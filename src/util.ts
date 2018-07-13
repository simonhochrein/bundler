import * as Path from "path";
import * as FileSystem from "fs";

export function ensureDirectoryExistence(FilePath) {
    var dirname = Path.dirname(FilePath);
    if (FileSystem.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    FileSystem.mkdirSync(dirname);
}

export function ensureDirectory(DirectoryPath) {
    if (FileSystem.existsSync(DirectoryPath)) {
        return true;
    }
    ensureDirectoryExistence(Path.dirname(DirectoryPath));
    FileSystem.mkdirSync(DirectoryPath);
}
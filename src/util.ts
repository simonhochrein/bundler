import * as Path from "path";
import * as FileSystem from "fs";

export function ensureDirectoryExistence(FilePath) {
    if (!FileSystem.existsSync(FilePath)) {
        if (FileSystem.existsSync(Path.dirname(FilePath))) {
            FileSystem.mkdirSync(FilePath);
        } else {
            ensureDirectoryExistence(Path.dirname(FilePath));
        }
    }
}

export function ensureDirectory(DirectoryPath) {
    if (FileSystem.existsSync(DirectoryPath)) {
        return true;
    }
    ensureDirectoryExistence(Path.dirname(DirectoryPath));
    FileSystem.mkdirSync(DirectoryPath);
}
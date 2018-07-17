import * as Path from "path";
import * as FileSystem from "fs";

export function ensureDirectoryExistence(FilePath) {
    if (!FileSystem.existsSync(FilePath)) {
        if (!FileSystem.existsSync(Path.dirname(FilePath))) {
            ensureDirectoryExistence(Path.dirname(FilePath));
        }
        FileSystem.mkdirSync(FilePath);
    }
}

export function ensureDirectory(FilePath) {
    ensureDirectoryExistence(Path.dirname(FilePath));
}
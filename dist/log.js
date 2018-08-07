"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var timer = null;
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.Error = function (Message) {
        // Readline.cursorTo(process.stdout, 0, 1);
        // Readline.clearLine(process.stdout, 1);
        process.stdout.write(Message.red + "\n");
    };
    Log.Info = function (Message) {
        // Readline.cursorTo(process.stdout, 0, 1);
        // Readline.clearLine(process.stdout, 1);
        process.stdout.write(Message.blue + "\n");
    };
    Log.Success = function (Message) {
        // Readline.cursorTo(process.stdout, 0, 1);
        // Readline.clearLine(process.stdout, 1);
        process.stdout.write(Message.green + "\n");
    };
    Log.Time = function () {
        timer = Date.now();
    };
    Log.TimeEnd = function (Str) {
        var ms = Date.now() - timer;
        Log.Success(Str.replace("%", (ms / 1000).toString()));
    };
    return Log;
}());
exports.Log = Log;

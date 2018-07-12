"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var timer = null;
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.Error = function (Message) {
        console.log(Message.red);
    };
    Log.Info = function (Message) {
        console.log(Message.blue);
    };
    Log.Success = function (Message) {
        console.log(Message.green);
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

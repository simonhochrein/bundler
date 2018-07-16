import "colors";
import * as Readline from "readline";

var timer: number = null;

export class Log {
    static Error(Message: string) {
        console.log(Message.red);
    }
    static Info(Message: string) {
        Readline.cursorTo(process.stdout, 0, 1);
        Readline.clearLine(process.stdout, 1);
        process.stdout.write(Message.blue);
    }
    static Success(Message: string) {
        Readline.cursorTo(process.stdout, 0, 1);
        Readline.clearLine(process.stdout, 1);
        process.stdout.write(Message.green);
    }
    static Time() {
        timer = Date.now();
    }
    static TimeEnd(Str: string) {
        var ms = Date.now() - timer;
        Log.Success(Str.replace("%", (ms / 1000).toString()));
    }
}
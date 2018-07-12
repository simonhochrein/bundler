import "colors";

var timer: number = null;

export class Log {
    static Error(Message: string) {
        console.log(Message.red);
    }
    static Info(Message: string) {
        console.log(Message.blue);
    }
    static Success(Message: string) {
        console.log(Message.green);
    }
    static Time() {
        timer = Date.now();
    }
    static TimeEnd(Str: string) {
        var ms = Date.now() - timer;
        Log.Success(Str.replace("%", (ms / 1000).toString()));
    }
}
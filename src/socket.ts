import { Worker } from "cluster";
import { EventEmitter } from "events";

interface ISocketMessage {
    type: string;
    data: any;
}

export class Socket extends EventEmitter {
    public socket: any;
    constructor()
    constructor(WorkerProcess: Worker)
    constructor(WorkerProcess?: Worker) {
        super();
        if (WorkerProcess) {
            this.socket = WorkerProcess;
        } else {
            this.socket = process;
        }
        this.socket.on("message", (Message: ISocketMessage) => {
            this.emit(Message.type, ...Message.data);
        });
    }
    send(Type: string): void;
    send(Type: string, ...Arguments: any[]): void;
    send(Arg1: any, ...Arg2: any[]) {
        this.socket.send({
            type: Arg1,
            data: Arg2
        });
    }
}
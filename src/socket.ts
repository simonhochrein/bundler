import { Worker } from 'cluster'
import { EventEmitter } from 'events';

interface SocketMessage {
    type: string;
    data: any;
}

export class Socket extends EventEmitter {
    public socket: any
    constructor()
    constructor(worker: Worker)
    constructor(worker?: Worker) {
        super()
        if (worker) {
            this.socket = worker;
        } else {
            this.socket = process
        }
        this.socket.on("message", ({ type, data }: SocketMessage) => {
            this.emit(type, ...data)
        })
    }
    send(type: string): void
    send(type: string, ...args: any[]): void
    send(arg1: any, ...arg2: any[]) {
        this.socket.send({
            type: arg1,
            data: arg2
        })
    }
}
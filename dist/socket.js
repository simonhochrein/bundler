"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var Socket = /** @class */ (function (_super) {
    __extends(Socket, _super);
    function Socket(worker) {
        var _this = _super.call(this) || this;
        if (worker) {
            _this.socket = worker;
        }
        else {
            _this.socket = process;
        }
        _this.socket.on("message", function (_a) {
            var type = _a.type, data = _a.data;
            _this.emit.apply(_this, [type].concat(data));
        });
        return _this;
    }
    Socket.prototype.send = function (arg1) {
        var arg2 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg2[_i - 1] = arguments[_i];
        }
        this.socket.send({
            type: arg1,
            data: arg2
        });
    };
    return Socket;
}(events_1.EventEmitter));
exports.Socket = Socket;

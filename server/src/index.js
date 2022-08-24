"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    ws.on("open", () => {
        console.log("open");
        fs_1.default.appendFileSync("./db/1.txt", "o:" + new Date().toLocaleTimeString());
    });
    ws.on("close", () => {
        console.log("closed");
        fs_1.default.appendFileSync("./db/1.txt", "c:" + new Date().toLocaleTimeString());
    });
    ws.send("lobby");
});

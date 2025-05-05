"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./user.routes"));
const client_routes_1 = __importDefault(require("./client.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/clientes", client_routes_1.default);
app.use("/usuarios", user_routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});
exports.default = app;

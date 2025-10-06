"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const promise_1 = __importDefault(require("mysql2/promise"));
const user_routes_1 = __importDefault(require("./user.routes"));
const paciente_routes_1 = __importDefault(require("./paciente.routes"));
const perfil_routes_1 = __importDefault(require("./perfil.routes"));
const consulta_routes_1 = __importDefault(require("./consulta.routes"));
const horario_routes_1 = __importDefault(require("./horario.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const register_routes_1 = __importDefault(require("./register.routes"));
if (!process.env.JWT_SECRET) {
    throw new Error("A variável de ambiente JWT_SECRET não está definida.");
}
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE || !process.env.DB_PORT) {
    throw new Error("As variáveis de ambiente do banco de dados não estão configuradas corretamente.");
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
// Adiciona uma rota para a raiz
app.get("/", (req, res) => {
    res.status(200).json({ message: "API Fisioterapia está funcionando!" });
});
app.use("/usuario", user_routes_1.default);
app.use("/paciente", paciente_routes_1.default); // Exemplo para rotas de paciente
app.use("/perfil", perfil_routes_1.default);
app.use("/consulta", consulta_routes_1.default);
app.use("/horario", horario_routes_1.default);
app.use("/auth", auth_routes_1.default); // Certifique-se de que esta linha está presente
app.use("/register", register_routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: err.message || "Internal Server Error" });
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield promise_1.default.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: Number(process.env.DB_PORT),
        });
        console.log("Conexão com o banco de dados bem-sucedida!");
        connection.end();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Erro ao conectar ao banco de dados:", error.message);
        }
        else {
            console.error("Erro ao conectar ao banco de dados:", error);
        }
        process.exit(1);
    }
}))();
exports.default = app;

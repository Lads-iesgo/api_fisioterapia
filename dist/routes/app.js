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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const prisma_1 = require("../config/prisma");
const user_routes_1 = __importDefault(require("./user.routes"));
const paciente_routes_1 = __importDefault(require("./paciente.routes"));
const perfil_routes_1 = __importDefault(require("./perfil.routes"));
const consulta_routes_1 = __importDefault(require("./consulta.routes"));
const horario_routes_1 = __importDefault(require("./horario.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const register_routes_1 = __importDefault(require("./register.routes"));
const indisponibilidade_routes_1 = __importDefault(require("./indisponibilidade.routes"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
if (!process.env.JWT_SECRET) {
    throw new Error("A variável de ambiente JWT_SECRET não está definida.");
}
if (!process.env.DATABASE_URL) {
    throw new Error("A variável de ambiente DATABASE_URL não está definida.");
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
app.get("/", (req, res) => {
    res.status(200).json({ message: "API Fisioterapia está funcionando!" });
});
// Rotas públicas (sem autenticação)
app.use("/auth", auth_routes_1.default);
app.use("/register", register_routes_1.default);
// Rotas protegidas (com autenticação e RBAC)
app.use("/usuario", authMiddleware_1.authMiddleware, rbacMiddleware_1.readOnlyForStudents, user_routes_1.default);
app.use("/paciente", authMiddleware_1.authMiddleware, rbacMiddleware_1.readOnlyForStudents, paciente_routes_1.default);
app.use("/perfil", authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.checkRole)("professor", "coordenador", "admin"), perfil_routes_1.default);
app.use("/consulta", authMiddleware_1.authMiddleware, rbacMiddleware_1.readOnlyForStudents, rbacMiddleware_1.applyConsultaDataIsolation, consulta_routes_1.default);
app.use("/horario", authMiddleware_1.authMiddleware, rbacMiddleware_1.readOnlyForStudents, horario_routes_1.default);
app.use("/indisponibilidade", authMiddleware_1.authMiddleware, rbacMiddleware_1.readOnlyForStudents, indisponibilidade_routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: err.message || "Internal Server Error" });
});
// Testa conexão com o banco via Prisma ao iniciar
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.prisma.$connect();
        console.log("Conexão com o banco de dados bem-sucedida!");
        yield prisma_1.prisma.$disconnect();
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

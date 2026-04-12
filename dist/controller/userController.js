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
exports.getFisioterapeutas = exports.updateUser = exports.createUser = exports.getUsersById = exports.getUsers = void 0;
const prisma_1 = require("../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
// IDs dos perfis no banco: 4=aluno, 5=fisioterapeuta
const PERFIS_FISIOTERAPEUTA = [4, 5];
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield prisma_1.prisma.usuario.findMany({
            select: {
                id: true,
                nome_completo: true,
                email: true,
                telefone: true,
                cpf: true,
                semestre: true,
                perfil_id: true,
            },
        });
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Erro ao buscar usuários:", error);
        next(error);
    }
});
exports.getUsers = getUsers;
const getUsersById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        const row = yield prisma_1.prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                nome_completo: true,
                email: true,
                telefone: true,
                cpf: true,
                semestre: true,
                perfil_id: true,
            },
        });
        if (!row) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        res.status(200).json(row);
    }
    catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        next(error);
    }
});
exports.getUsersById = getUsersById;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome_completo, email, senha, telefone, cpf, semestre, perfil_id, } = req.body;
        if (!nome_completo || !email || !senha || perfil_id === undefined) {
            res.status(400).json({
                message: "Campos nome_completo, email, senha e perfil_id são obrigatórios.",
            });
            return;
        }
        // Verifica email duplicado
        const existingEmail = yield prisma_1.prisma.usuario.findFirst({ where: { email } });
        if (existingEmail) {
            res.status(409).json({ message: "Email já cadastrado." });
            return;
        }
        // Verifica CPF duplicado
        if (cpf) {
            const existingCpf = yield prisma_1.prisma.usuario.findFirst({ where: { cpf } });
            if (existingCpf) {
                res.status(409).json({ message: "CPF já cadastrado." });
                return;
            }
        }
        const senha_hash = yield bcrypt_1.default.hash(senha, saltRounds);
        const novoUsuario = yield prisma_1.prisma.usuario.create({
            data: {
                nome_completo,
                email,
                senha_hash,
                telefone,
                cpf,
                semestre,
                perfil_id: Number(perfil_id),
            },
            select: {
                id: true,
                nome_completo: true,
                email: true,
                telefone: true,
                cpf: true,
                semestre: true,
                perfil_id: true,
            },
        });
        res.status(201).json(novoUsuario);
    }
    catch (error) {
        console.error("Erro ao criar usuário:", error);
        if ((error === null || error === void 0 ? void 0 : error.code) === "P2002") {
            res.status(409).json({ message: "Erro: Email ou CPF já cadastrado." });
            return;
        }
        next(error);
    }
});
exports.createUser = createUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome_completo, email, telefone, cpf, semestre, perfil_id, } = req.body;
        const updateData = {};
        if (nome_completo !== undefined)
            updateData.nome_completo = nome_completo;
        if (telefone !== undefined)
            updateData.telefone = telefone;
        if (semestre !== undefined)
            updateData.semestre = semestre;
        if (perfil_id !== undefined)
            updateData.perfil_id = Number(perfil_id);
        if (email !== undefined) {
            const existing = yield prisma_1.prisma.usuario.findFirst({
                where: { email, NOT: { id } },
            });
            if (existing) {
                res.status(409).json({ message: "Novo email já cadastrado para outro usuário." });
                return;
            }
            updateData.email = email;
        }
        if (cpf !== undefined) {
            const existing = yield prisma_1.prisma.usuario.findFirst({
                where: { cpf, NOT: { id } },
            });
            if (existing) {
                res.status(409).json({ message: "Novo CPF já cadastrado para outro usuário." });
                return;
            }
            updateData.cpf = cpf;
        }
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
            return;
        }
        const updatedUser = yield prisma_1.prisma.usuario.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                nome_completo: true,
                email: true,
                telefone: true,
                cpf: true,
                semestre: true,
                perfil_id: true,
            },
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        if ((error === null || error === void 0 ? void 0 : error.code) === "P2002") {
            res.status(409).json({ message: "Erro: Email ou CPF já cadastrado." });
            return;
        }
        if ((error === null || error === void 0 ? void 0 : error.code) === "P2025") {
            res.status(404).json({ message: "Usuário não encontrado para atualização" });
            return;
        }
        next(error);
    }
});
exports.updateUser = updateUser;
// Retorna todos os usuários que são Fisioterapeutas/Alunos (perfil_id = PERFIL_ID_FISIOTERAPEUTA)
const getFisioterapeutas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield prisma_1.prisma.usuario.findMany({
            where: { perfil_id: { in: PERFIS_FISIOTERAPEUTA } },
            select: {
                id: true,
                nome_completo: true,
                email: true,
                telefone: true,
                cpf: true,
                semestre: true,
                perfil_id: true,
            },
        });
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Erro ao buscar fisioterapeutas:", error);
        next(error);
    }
});
exports.getFisioterapeutas = getFisioterapeutas;

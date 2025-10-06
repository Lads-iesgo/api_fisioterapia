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
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10; // Custo do processamento do hash da senha
// IMPORTANTE: Defina o ID correto para o perfil de Fisioterapeuta/Aluno
const PERFIL_ID_FISIOTERAPEUTA = 2; // <--- SUBSTITUA PELO ID CORRETO DO SEU BANCO DE DADOS
// Lista todos os usuários (sem a senha)
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query("SELECT id, nome_completo, email, telefone, cpf, semestre, perfil_id FROM usuario");
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Erro ao buscar usuários:", error);
        next(error);
    }
});
exports.getUsers = getUsers;
// Busca usuário por ID (sem a senha)
const getUsersById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const [rows] = yield db_1.default.query("SELECT id, nome_completo, email, telefone, cpf, semestre, perfil_id FROM usuario WHERE id = ?", [id]);
        if (rows.length === 0) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        next(error);
    }
});
exports.getUsersById = getUsersById;
// Cria um novo usuário
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome_completo, email, senha, // Senha em texto plano vinda do cliente
        telefone, cpf, semestre, perfil_id, } = req.body;
        if (!nome_completo || !email || !senha || perfil_id === undefined) {
            res.status(400).json({
                message: "Campos nome_completo, email, senha e perfil_id são obrigatórios.",
            });
            return;
        }
        // Verifica se o email já existe
        const [existingUser] = yield db_1.default.query("SELECT id FROM usuario WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            res.status(409).json({ message: "Email já cadastrado." });
            return;
        }
        // Verifica se o CPF já existe (se fornecido)
        if (cpf) {
            const [existingCpf] = yield db_1.default.query("SELECT id FROM usuario WHERE cpf = ?", [cpf]);
            if (existingCpf.length > 0) {
                res.status(409).json({ message: "CPF já cadastrado." });
                return;
            }
        }
        const senha_hash = yield bcrypt_1.default.hash(senha, saltRounds);
        const [result] = yield db_1.default.query("INSERT INTO usuario (nome_completo, email, senha_hash, telefone, cpf, semestre, perfil_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [nome_completo, email, senha_hash, telefone, cpf, semestre, perfil_id]);
        const novoUsuario = {
            id: result.insertId,
            nome_completo,
            email,
            telefone,
            cpf,
            semestre,
            perfil_id,
        };
        res.status(201).json(novoUsuario);
    }
    catch (error) {
        console.error("Erro ao criar usuário:", error);
        // Adicionar tratamento para erros de chave única (email, cpf) se não tratados acima
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                message: "Erro: Email ou CPF já cadastrado.",
                details: error.sqlMessage,
            });
            return;
        }
        next(error);
    }
});
exports.createUser = createUser;
// Atualiza um usuário existente
// Nota: A atualização de senha geralmente é tratada em uma rota separada por segurança.
// Esta função não atualiza a senha.
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome_completo, email, telefone, cpf, semestre, perfil_id, } = req.body;
        // Coleta os campos que foram fornecidos para atualização
        const fieldsToUpdate = [];
        const values = [];
        if (nome_completo !== undefined) {
            fieldsToUpdate.push("nome_completo = ?");
            values.push(nome_completo);
        }
        if (email !== undefined) {
            // Verifica se o novo email já existe para outro usuário
            const [existingUser] = yield db_1.default.query("SELECT id FROM usuario WHERE email = ? AND id != ?", [email, id]);
            if (existingUser.length > 0) {
                res
                    .status(409)
                    .json({ message: "Novo email já cadastrado para outro usuário." });
                return;
            }
            fieldsToUpdate.push("email = ?");
            values.push(email);
        }
        if (telefone !== undefined) {
            fieldsToUpdate.push("telefone = ?");
            values.push(telefone);
        }
        if (cpf !== undefined) {
            // Verifica se o novo CPF já existe para outro usuário
            const [existingCpf] = yield db_1.default.query("SELECT id FROM usuario WHERE cpf = ? AND id != ?", [cpf, id]);
            if (existingCpf.length > 0) {
                res
                    .status(409)
                    .json({ message: "Novo CPF já cadastrado para outro usuário." });
                return;
            }
            fieldsToUpdate.push("cpf = ?");
            values.push(cpf);
        }
        if (semestre !== undefined) {
            fieldsToUpdate.push("semestre = ?");
            values.push(semestre);
        }
        if (perfil_id !== undefined) {
            fieldsToUpdate.push("perfil_id = ?");
            values.push(perfil_id);
        }
        if (fieldsToUpdate.length === 0) {
            res
                .status(400)
                .json({ message: "Nenhum dado fornecido para atualização." });
            return;
        }
        values.push(id); // Adiciona o ID para a cláusula WHERE
        const query = `UPDATE usuario SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
        const [result] = yield db_1.default.query(query, values);
        if (result.affectedRows === 0) {
            res
                .status(404)
                .json({ message: "Usuário não encontrado para atualização" });
            return;
        }
        const [updatedUserRows] = yield db_1.default.query("SELECT id, nome_completo, email, telefone, cpf, semestre, perfil_id FROM usuario WHERE id = ?", [id]);
        res.status(200).json(updatedUserRows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                message: "Erro: Email ou CPF já cadastrado.",
                details: error.sqlMessage,
            });
            return;
        }
        next(error);
    }
});
exports.updateUser = updateUser;
// Busca todos os usuários que são Fisioterapeutas/Alunos
const getFisioterapeutas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query("SELECT id, nome_completo, email, telefone, cpf, semestre, perfil_id FROM usuario WHERE perfil_id = ?", [PERFIL_ID_FISIOTERAPEUTA] // Filtra pelo ID do perfil de fisioterapeuta
        );
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Erro ao buscar fisioterapeutas:", error);
        next(error);
    }
});
exports.getFisioterapeutas = getFisioterapeutas;
// Você precisará adicionar uma função para deletar usuários se necessário.
// export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => { ... }

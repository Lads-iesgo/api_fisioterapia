import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  "/register",
  upload.single("anexarArterias"),
  [
    body("nome_completo").trim().notEmpty().withMessage("Nome completo é obrigatório."),
    body("email").isEmail().withMessage("E-Mail inválido."),
    body("senha_hash").trim().notEmpty().withMessage("Senha é obrigatória."),
    body("telefone").trim().notEmpty().withMessage("Telefone é obrigatório."),
    body("cpf").trim().notEmpty().withMessage("CPF é obrigatório."),
    body("semestre").trim().notEmpty().withMessage("Semestre é obrigatório."),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { nome_completo, email, senha_hash, telefone, cpf, semestre } = req.body;
    const arquivo = req.file;

    try {
      const senha_hashFinal = await bcrypt.hash(senha_hash, 10);

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome_completo,
          email,
          senha_hash: senha_hashFinal,
          telefone,
          cpf,
          semestre,
          perfil_id: 2, // Perfil padrão para aluno/fisioterapeuta
        },
      });

      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        id: novoUsuario.id,
      });
    } catch (err) {
      console.error("Erro ao inserir dados:", err);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
);

export default router;
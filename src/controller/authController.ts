import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, senha } = req.body;

    // Verifica se o usuário existe no banco de dados
    const [rows]: any = await pool.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    const usuario = rows[0];

    // Verifica se a senha está correta
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      res.status(401).json({ message: "Senha inválida." });
      return;
    }

    // Gera um token JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
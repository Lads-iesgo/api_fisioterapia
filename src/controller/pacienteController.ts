import pool from "../config/db";

import { PacienteInterface } from "../interfaces/types";

import { Request, Response, NextFunction } from "express";

export const getPaciente = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const accessAction = req.accessAction;

    // If user has read:own permission (student/aluno), filter by their consultations
    if (accessAction === "read:own" && userId) {
      const [rows] = await pool.query(
        `SELECT DISTINCT p.* FROM paciente p
         INNER JOIN consulta c ON p.id = c.paciente_id
         WHERE c.fisioterapeuta_id = ?`,
        [userId]
      );
      res.status(200).json(rows);
    } else {
      // For read:any (professor, coordenador, admin), return all patients
      const [rows] = await pool.query("SELECT * FROM paciente");
      res.status(200).json(rows);
    }
  } catch (error) {
    next(error);
  }
};

export const getPacienteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    const accessAction = req.accessAction;

    // If user has read:own permission (student/aluno), check if they have consultation with this patient
    if (accessAction === "read:own" && userId) {
      const [rows]: any = await pool.query(
        `SELECT p.* FROM paciente p
         INNER JOIN consulta c ON p.id = c.paciente_id
         WHERE p.id = ? AND c.fisioterapeuta_id = ?`,
        [id, userId]
      );

      if (rows.length === 0) {
        res.status(404).json({ message: "Paciente não encontrado ou você não tem permissão para visualizá-lo" });
        return;
      }

      res.status(200).json(rows[0]);
    } else {
      // For read:any (professor, coordenador, admin), return patient if exists
      const [rows]: any = await pool.query(
        "SELECT * FROM paciente WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        res.status(404).json({ message: "Paciente não encontrado" });
        return;
      }

      res.status(200).json(rows[0]);
    }
  } catch (error) {
    next(error);
  }
};

export const createPaciente = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      nome_completo,
      email,
      telefone,
      genero,
      data_nascimento,
      cpf,
      cep,
      endereco,
    }: PacienteInterface = req.body;

    const [result]: any = await pool.query(
      "INSERT INTO paciente (nome_completo, email, telefone, genero, data_nascimento, cpf, cep, endereco) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nome_completo,
        email,
        telefone,
        genero,
        data_nascimento,
        cpf,
        cep,
        endereco,
      ]
    );

    const newPaciente: PacienteInterface = {
      id: result.insertId,
      nome_completo,
      email,
      telefone,
      genero,
      data_nascimento,
      cpf,
      cep,
      endereco,
    };

    res.status(201).json(newPaciente);
  } catch (error) {
    next(error);
  }
};

export const updatePaciente = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const campos = [
      "nome_completo",
      "email",
      "telefone",
      "genero",
      "data_nascimento",
      "cpf",
      "cep",
      "endereco",
    ];

    // Monta dinamicamente os campos a serem atualizados
    const updates = [];
    const values = [];
    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        updates.push(`${campo} = ?`);
        values.push(req.body[campo]);
      }
    }

    if (updates.length === 0) {
      res.status(400).json({ message: "Nenhum campo para atualizar." });
      return;
    }

    values.push(id);

    const [result]: any = await pool.query(
      `UPDATE paciente SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Paciente não encontrado" });
      return;
    }

    res.status(200).json({ id, ...req.body });
  } catch (error) {
    next(error);
  }
};

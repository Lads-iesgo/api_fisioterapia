import pool from "../config/db";

import { HorarioInterface } from "../interfaces/types";

import { Request, Response, NextFunction } from "express";

export const getHorario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const accessAction = req.accessAction;

    // If user has read:own permission (student/aluno), filter by their consultation schedules
    if (accessAction === "read:own" && userId) {
      const [rows] = await pool.query(
        `SELECT DISTINCT h.* FROM horario_agendamento h
         INNER JOIN consulta c ON h.id = c.horario_id
         WHERE c.fisioterapeuta_id = ?`,
        [userId]
      );
      res.status(200).json(rows);
    } else {
      // For read:any (professor, coordenador, admin), return all schedules
      const [rows] = await pool.query("SELECT * FROM horario_agendamento");
      res.status(200).json(rows);
    }
  } catch (error) {
    next(error);
  }
};

export const getHorarioById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    const accessAction = req.accessAction;

    // If user has read:own permission (student/aluno), check if they have consultation with this schedule
    if (accessAction === "read:own" && userId) {
      const [rows]: any = await pool.query(
        `SELECT h.* FROM horario_agendamento h
         INNER JOIN consulta c ON h.id = c.horario_id
         WHERE h.id = ? AND c.fisioterapeuta_id = ?`,
        [id, userId]
      );

      if (rows.length === 0) {
        res.status(404).json({ message: "Horário não encontrado ou você não tem permissão para visualizá-lo" });
        return;
      }

      res.status(200).json(rows[0]);
    } else {
      // For read:any (professor, coordenador, admin), return schedule if exists
      const [rows]: any = await pool.query(
        "SELECT * FROM horario_agendamento WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        res.status(404).json({ message: "Horário não encontrado" });
        return;
      }

      res.status(200).json(rows[0]);
    }
  } catch (error) {
    next(error);
  }
};

export const createHorario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { horario }: HorarioInterface = req.body;

    const [result]: any = await pool.query(
      "INSERT INTO horario_agendamento (horario) VALUES (?)",
      [horario]
    );

    const newHorario: HorarioInterface = {
      id: result.insertId,
      horario,
    };

    res.status(201).json(newHorario);
  } catch (error) {
    next(error);
  }
};

export const updateHorario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { horario } = req.body;

    if (!horario) {
      res
        .status(400)
        .json({ message: "O campo horãrio é obrigatório para atualização." });
      return;
    }

    const [result]: any = await pool.query(
      "UPDATE horario_agendamento SET horario = ? WHERE id = ?",
      [horario, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Horãrio não encontrado" });
      return;
    }

    res.status(200).json({ id, horario });
  } catch (error) {
    next(error);
  }
};

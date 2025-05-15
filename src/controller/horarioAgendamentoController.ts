// filepath: d:\Lads\api_fisioterapia\src\controller\horarioAgendamentoController.ts
import pool from "../config/db";
import { HorarioAgendamentoInterface } from "../interfaces/types";
import { Request, Response, NextFunction } from "express";

// Lista todos os horários de agendamento
export const getHorariosAgendamento = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [rows] = await pool.query("SELECT id, TIME_FORMAT(horario, '%H:%i') as horario FROM horario_agendamento ORDER BY horario");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar horários de agendamento:", error);
    next(error);
  }
};

// Busca horário de agendamento por ID
export const getHorarioAgendamentoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const [rows]: any[] = await pool.query(
      "SELECT id, TIME_FORMAT(horario, '%H:%i') as horario FROM horario_agendamento WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Horário de agendamento não encontrado" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar horário de agendamento por ID:", error);
    next(error);
  }
};

// Cria um novo horário de agendamento
export const createHorarioAgendamento = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { horario } = req.body as HorarioAgendamentoInterface;

    if (!horario) {
      res.status(400).json({ message: "Campo horario é obrigatório." });
      return;
    }

    // Validação simples do formato HH:MM
    if (!/^\d{2}:\d{2}$/.test(horario) && !/^\d{2}:\d{2}:\d{2}$/.test(horario)) {
        res.status(400).json({ message: "Formato de horário inválido. Use HH:MM ou HH:MM:SS." });
        return;
    }

    const [result]: any = await pool.query(
      "INSERT INTO horario_agendamento (horario) VALUES (?)",
      [horario]
    );

    const novoHorario: HorarioAgendamentoInterface = {
      id: result.insertId,
      horario,
    };
    res.status(201).json(novoHorario);
  } catch (error) {
    if ((error as any).code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: "Este horário já está cadastrado." });
        return;
    }
    console.error("Erro ao criar horário de agendamento:", error);
    next(error);
  }
};

// Deleta um horário de agendamento
export const deleteHorarioAgendamento = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    const [result]: any = await pool.query(
      "DELETE FROM horario_agendamento WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Horário de agendamento não encontrado para deleção" });
      return;
    }

    res.status(204).send(); // No Content
  } catch (error) {
    // Adicionar tratamento para erro de chave estrangeira se horários estiverem em uso
    if ((error as any).code === 'ER_ROW_IS_REFERENCED_2') {
        res.status(409).json({ message: "Não é possível deletar o horário, pois ele está sendo utilizado em consultas." });
        return;
    }
    console.error("Erro ao deletar horário de agendamento:", error);
    next(error);
  }
};
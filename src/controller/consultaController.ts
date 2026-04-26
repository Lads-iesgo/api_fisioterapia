import { prisma } from "../config/prisma";
import { ConsultaInterface } from "../interfaces/types";
import { Request, Response, NextFunction } from "express";

type ConsultaStatus = "agendada" | "realizada" | "cancelada";

export const getConsulta = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Usa isolamento de dados se foi definido pelo middleware
		const where = (req as any).dataIsolation || {};

		const rows = await prisma.consulta.findMany({ where });
		res.status(200).json(rows);
	} catch (error) {
		next(error);
	}
};

export const getConsultaById = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		const row = await prisma.consulta.findUnique({ where: { id } });

		if (!row) {
			res.status(404).json({ message: "Consulta não encontrada" });
			return;
		}

		res.status(200).json(row);
	} catch (error) {
		next(error);
	}
};

export const createConsulta = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		let {
			paciente_id,
			data_consulta,
			horario_id,
			aluno_id,
		}: ConsultaInterface = req.body;

		// Converte para 'YYYY-MM-DD' se vier no formato ISO
		if (typeof data_consulta === "string" && data_consulta.includes("T")) {
			data_consulta = data_consulta.split("T")[0];
		}

		// Verifica se o dia está marcado como indisponível
		const dataAlvo = new Date((data_consulta as string) + "T00:00:00.000Z");
		const diaIndisponivel = await prisma.indisponibilidade.findFirst({
			where: { data_indisponivel: dataAlvo },
		});

		if (diaIndisponivel) {
			res.status(409).json({
				message: "Não é possível cadastrar consulta neste dia. O dia está marcado como indisponível.",
			});
			return;
		}

		const newConsulta = await prisma.consulta.create({
			data: {
				paciente_id: Number(paciente_id),
				data_consulta: new Date((data_consulta as string) + "T00:00:00.000Z"),
				horario_id: Number(horario_id),
				aluno_id: Number(aluno_id),
			},
		});

		res.status(201).json(newConsulta);
	} catch (error: any) {
		if (error?.code === "P2002") {
			res.status(409).json({
				message:
					"Já existe uma consulta para esse paciente, data, horário e fisioterapeuta.",
			});
			return;
		}
		next(error);
	}
};

export const updateConsulta = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		const campos = [
			"paciente_id",
			"data_consulta",
			"horario_id",
			"aluno_id",
			"status",
		];

		const updateData: any = {};
		for (const campo of campos) {
			if (req.body[campo] !== undefined) {
				if (campo === "data_consulta") {
					const d = req.body[campo];
					updateData[campo] = new Date(
						typeof d === "string" && d.includes("T")
							? d.split("T")[0] + "T00:00:00.000Z"
							: d,
					);
				} else if (
					["paciente_id", "horario_id", "aluno_id"].includes(campo)
				) {
					updateData[campo] = Number(req.body[campo]);
				} else if (campo === "status") {
					updateData[campo] = (req.body[campo] as ConsultaStatus) ?? null;
				} else {
					updateData[campo] = req.body[campo];
				}
			}
		}

		if (Object.keys(updateData).length === 0) {
			res.status(400).json({ message: "Nenhum campo para atualizar." });
			return;
		}

		const updated = await prisma.consulta.update({
			where: { id },
			data: updateData,
		});

		res.status(200).json(updated);
	} catch (error: any) {
		if (error?.code === "P2025") {
			res.status(404).json({ message: "Consulta não encontrada" });
			return;
		}
		next(error);
	}
};

export const deleteConsulta = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		await prisma.consulta.delete({ where: { id } });
		res.status(200).json({ message: "Consulta excluída com sucesso" });
	} catch (error: any) {
		if (error?.code === "P2025") {
			res.status(404).json({ message: "Consulta não encontrada" });
			return;
		}
		next(error);
	}
};

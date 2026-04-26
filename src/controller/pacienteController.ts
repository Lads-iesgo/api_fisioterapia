import { prisma } from "../config/prisma";
import { PacienteInterface } from "../interfaces/types";
import { Request, Response, NextFunction } from "express";

type PacienteGenero = "masculino" | "feminino" | "nao_informar";

function parseDateSafe(value: any): Date | null {
	if (!value) return null;
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d;
}

export const getPaciente = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const rows = await prisma.paciente.findMany();
		res.status(200).json(rows);
	} catch (error) {
		next(error);
	}
};

export const getPacienteById = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		const row = await prisma.paciente.findUnique({ where: { id } });

		if (!row) {
			res.status(404).json({ message: "Paciente não encontrado" });
			return;
		}

		res.status(200).json(row);
	} catch (error) {
		next(error);
	}
};

export const createPaciente = async (
	req: Request,
	res: Response,
	next: NextFunction,
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

		const newPaciente = await prisma.paciente.create({
			data: {
				nome_completo,
				email,
				telefone,
				genero: (genero as PacienteGenero) ?? null,
				data_nascimento: parseDateSafe(data_nascimento),
				cpf,
				cep,
				endereco,
			},
		});

		res.status(201).json(newPaciente);
	} catch (error) {
		next(error);
	}
};

export const updatePaciente = async (
	req: Request,
	res: Response,
	next: NextFunction,
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
			"ativo",
		];

		const updateData: any = {};
		for (const campo of campos) {
			if (req.body[campo] !== undefined) {
				if (campo === "data_nascimento") {
					updateData[campo] = parseDateSafe(req.body[campo]);
				} else if (campo === "ativo") {
					updateData[campo] = Number(req.body[campo]);
				} else {
					updateData[campo] =
						campo === "genero"
							? ((req.body[campo] as PacienteGenero) ?? null)
							: req.body[campo];
				}
			}
		}

		if (Object.keys(updateData).length === 0) {
			res.status(400).json({ message: "Nenhum campo para atualizar." });
			return;
		}

		const updated = await prisma.paciente.update({
			where: { id },
			data: updateData,
		});
		res.status(200).json(updated);
	} catch (error: any) {
		if (error?.code === "P2025") {
			res.status(404).json({ message: "Paciente não encontrado" });
			return;
		}
		next(error);
	}
};

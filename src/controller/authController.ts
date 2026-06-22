import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { email, senha } = req.body;

		const usuario = await prisma.usuario.findFirst({
			where: { email },
			include: { perfil: true },
		});

		if (!usuario) {
			res.status(401).json({
				status: "error",
				message: "Usuário ou senha inválido.",
			});
			return;
		}

		if (usuario.ativo === 0) {
			res.status(403).json({
				status: "error",
				message:
					"Sua conta foi desativada. Entre em contato com a coordenação.",
			});
			return;
		}

		const senhaValida = await bcrypt.compare(senha, usuario.senha_hash ?? "");
		if (!senhaValida) {
			res.status(401).json({
				status: "error",
				message: "Usuário ou senha inválido.",
			});
			return;
		}

		const nomePerfil = usuario.perfil?.nome ?? "Desconhecido";

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			res.status(500).json({
				status: "error",
				message:
					"Erro interno do servidor: configuração de autenticação ausente.",
			});
			return;
		}

		const tokenPayload = {
			id: usuario.id,
			role: nomePerfil,
		};

		const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "1h" });

		res.status(200).json({
			status: "success",
			message: "Login bem-sucedido!",
			token,
			user: {
				id: usuario.id,
				email: usuario.email,
				nome: usuario.nome_completo,
				perfil: nomePerfil,
			},
		});
	} catch (error) {
		console.error("Erro no login:", error);
		res.status(500).json({
			status: "error",
			message: "Ocorreu um erro durante o login. Por favor, tente novamente.",
		});
	}
};

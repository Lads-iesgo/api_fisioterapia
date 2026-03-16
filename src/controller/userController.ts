import { prisma } from "../config/prisma";
import { UserInterface } from "../interfaces/types";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

const saltRounds = 10;
// IDs dos perfis no banco: 4=aluno, 5=fisioterapeuta
const PERFIS_FISIOTERAPEUTA = [4, 5];

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rows = await prisma.usuario.findMany({
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
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    next(error);
  }
};

export const getUsersById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const row = await prisma.usuario.findUnique({
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
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      nome_completo,
      email,
      senha,
      telefone,
      cpf,
      semestre,
      perfil_id,
    }: UserInterface = req.body;

    if (!nome_completo || !email || !senha || perfil_id === undefined) {
      res.status(400).json({
        message: "Campos nome_completo, email, senha e perfil_id são obrigatórios.",
      });
      return;
    }

    // Verifica email duplicado
    const existingEmail = await prisma.usuario.findFirst({ where: { email } });
    if (existingEmail) {
      res.status(409).json({ message: "Email já cadastrado." });
      return;
    }

    // Verifica CPF duplicado
    if (cpf) {
      const existingCpf = await prisma.usuario.findFirst({ where: { cpf } });
      if (existingCpf) {
        res.status(409).json({ message: "CPF já cadastrado." });
        return;
      }
    }

    const senha_hash = await bcrypt.hash(senha, saltRounds);

    const novoUsuario = await prisma.usuario.create({
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
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if ((error as any)?.code === "P2002") {
      res.status(409).json({ message: "Erro: Email ou CPF já cadastrado." });
      return;
    }
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      nome_completo,
      email,
      telefone,
      cpf,
      semestre,
      perfil_id,
    }: UserInterface = req.body;

    const updateData: any = {};

    if (nome_completo !== undefined) updateData.nome_completo = nome_completo;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (semestre !== undefined) updateData.semestre = semestre;
    if (perfil_id !== undefined) updateData.perfil_id = Number(perfil_id);

    if (email !== undefined) {
      const existing = await prisma.usuario.findFirst({
        where: { email, NOT: { id } },
      });
      if (existing) {
        res.status(409).json({ message: "Novo email já cadastrado para outro usuário." });
        return;
      }
      updateData.email = email;
    }

    if (cpf !== undefined) {
      const existing = await prisma.usuario.findFirst({
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

    const updatedUser = await prisma.usuario.update({
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
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    if ((error as any)?.code === "P2002") {
      res.status(409).json({ message: "Erro: Email ou CPF já cadastrado." });
      return;
    }
    if ((error as any)?.code === "P2025") {
      res.status(404).json({ message: "Usuário não encontrado para atualização" });
      return;
    }
    next(error);
  }
};

// Retorna todos os usuários que são Fisioterapeutas/Alunos (perfil_id = PERFIL_ID_FISIOTERAPEUTA)
export const getFisioterapeutas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rows = await prisma.usuario.findMany({
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
  } catch (error) {
    console.error("Erro ao buscar fisioterapeutas:", error);
    next(error);
  }
};

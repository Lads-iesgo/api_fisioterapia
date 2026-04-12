import { prisma } from "../config/prisma";
import { PerfilInterface } from "../interfaces/types";
import { Request, Response, NextFunction } from "express";

export const getPerfil = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rows = await prisma.perfil.findMany();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

export const getPerfilById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const row = await prisma.perfil.findUnique({ where: { id } });

    if (!row) {
      res.status(404).json({ message: "Perfil não encontrado" });
      return;
    }

    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
};

export const createPerfil = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nome }: PerfilInterface = req.body;
    const newPerfil = await prisma.perfil.create({ data: { nome } });
    res.status(201).json(newPerfil);
  } catch (error) {
    next(error);
  }
};

export const updatePerfil = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nome } = req.body;

    if (!nome) {
      res.status(400).json({ message: "O campo nome é obrigatório para atualização." });
      return;
    }

    const updated = await prisma.perfil.update({ where: { id }, data: { nome } });
    res.status(200).json(updated);
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ message: "Perfil não encontrado" });
      return;
    }
    next(error);
  }
};

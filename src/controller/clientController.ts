import { Request, Response, NextFunction } from "express";
import users from "../../dados.json";

export const getClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getClientsById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const client = users.find((user) => user.id === id);

    if (!client) {
      res.status(404).json({ message: "Cliente não encontrado" });
      return;
    }

    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

export const createClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newClient = { id: users.length + 1, ...req.body };
    users.push(newClient);
    res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
};

export const updateClients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Cliente não encontrado" });
      return;
    }

    users[index] = { ...users[index], ...req.body };
    res.status(200).json(users[index]);
  } catch (error) {
    next(error);
  }
};

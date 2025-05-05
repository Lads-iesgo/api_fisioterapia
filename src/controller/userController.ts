import { Request, Response, NextFunction } from "express";
import users from "../../dados.json";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json(users);
  } catch (error) {
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
    const user = users.find((user) => user.id === id);

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
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
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    users[index] = { ...users[index], ...req.body };
    res.status(200).json(users[index]);
  } catch (error) {
    next(error);
  }
};

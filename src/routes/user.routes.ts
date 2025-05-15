import express from "express";
import {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
} from "../controller/userController";

const router = express.Router();

// Rotas de Usuários
router.get("/", getUsers); // GET /api/users
router.get("/:id", getUsersById); // GET /api/users/:id
router.post("/", createUser); // POST /api/users
router.put("/:id", updateUser); // PUT /api/users/:id

export default router;

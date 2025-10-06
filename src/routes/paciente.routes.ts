import express from "express";
import {
  getPaciente,
  getPacienteById,
  createPaciente,
  updatePaciente,
} from "../controller/pacienteController";

import { authMiddleware } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";

const router = express.Router();

// Rotas protegidas por autenticação e autorização
router.get("/", authMiddleware, authorize("paciente", "read:any"), getPaciente); // GET /paciente
router.get("/:id", authMiddleware, authorize("paciente", "read:any"), getPacienteById); // GET /paciente/:id
router.post("/", authMiddleware, authorize("paciente", "update:any"), createPaciente); // POST /paciente
router.put("/:id", authMiddleware, authorize("paciente", "update:any"), updatePaciente); // PUT /paciente/:id

export default router;

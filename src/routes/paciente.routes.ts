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

//Rotas Professor / Coordenador / Admin
router.get("/", authMiddleware, authorize("paciente", "read:any"), getPaciente); // GET /paciente 
//Rota Aluno
router.get("/", authMiddleware, authorize("paciente", "read:own"), getPaciente); // GET /paciente 
router.get("/:id", authMiddleware, authorize("paciente", "read:any"), getPacienteById); // GET /paciente/:id
router.post("/", createPaciente); // POST /paciente
router.put("/:id", updatePaciente); // PUT /paciente/:id

export default router;

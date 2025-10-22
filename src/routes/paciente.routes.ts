import express, { Request, Response, NextFunction } from "express";
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
// GET routes accept both read:own (aluno) and read:any (professor, coordenador, admin)
router.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("paciente", "read:own")(req, res, next);
  } else {
    return authorize("paciente", "read:any")(req, res, next);
  }
}, getPaciente);

router.get("/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("paciente", "read:own")(req, res, next);
  } else {
    return authorize("paciente", "read:any")(req, res, next);
  }
}, getPacienteById);

// POST and PUT only for professor, coordenador, admin
router.post("/", authMiddleware, authorize("paciente", "update:any"), createPaciente);
router.put("/:id", authMiddleware, authorize("paciente", "update:any"), updatePaciente);

export default router;

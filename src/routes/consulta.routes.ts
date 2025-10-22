import express, { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";
import {
  getConsulta,
  getConsultaById,
  createConsulta,
  updateConsulta,
  deleteConsulta,
} from "../controller/consultaController";

const router = express.Router();

// Rotas Consulta
// GET routes accept both read:own (aluno) and read:any (professor, coordenador, admin)
router.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("paciente", "read:own")(req, res, next);
  } else {
    return authorize("paciente", "read:any")(req, res, next);
  }
}, getConsulta);

router.get("/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("paciente", "read:own")(req, res, next);
  } else {
    return authorize("paciente", "read:any")(req, res, next);
  }
}, getConsultaById);

// POST, PUT, DELETE only for professor, coordenador, admin
router.post("/", authMiddleware, authorize("paciente", "update:any"), createConsulta);
router.put("/:id", authMiddleware, authorize("paciente", "update:any"), updateConsulta);
router.delete("/:id", authMiddleware, authorize("paciente", "delete:any"), deleteConsulta);

export default router;

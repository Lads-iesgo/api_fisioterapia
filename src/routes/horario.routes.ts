import express, { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";
import {
  getHorario,
  getHorarioById,
  createHorario,
  updateHorario,
} from "../controller/horarioController";

const router = express.Router();

// Rotas Horário
// GET routes accept both read:own (aluno) and read:any (professor, coordenador, admin)
router.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("horario", "read:own")(req, res, next);
  } else {
    return authorize("horario", "read:any")(req, res, next);
  }
}, getHorario);

router.get("/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("horario", "read:own")(req, res, next);
  } else {
    return authorize("horario", "read:any")(req, res, next);
  }
}, getHorarioById);

// POST and PUT only for professor, coordenador, admin
router.post("/", authMiddleware, authorize("horario", "update:any"), createHorario);
router.put("/:id", authMiddleware, authorize("horario", "update:any"), updateHorario);

export default router;

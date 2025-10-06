import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";
import {
  getHorario,
  getHorarioById,
  createHorario,
  updateHorario,
} from "../controller/horarioController";

const router = express.Router();

//Rotas Horário
router.get("/", authMiddleware, authorize("horario", "read:any"), getHorario); // GET /horario
router.get("/:id", authMiddleware, authorize("horario", "read:any"), getHorarioById); // GET horario/:id
router.post("/", authMiddleware, authorize("horario", "update:any"), createHorario); // POST /horario
router.put("/:id", authMiddleware, authorize("horario", "update:any"), updateHorario); // PUT /horario/:id

export default router;

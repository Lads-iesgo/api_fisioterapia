// filepath: d:\Lads\api_fisioterapia\src\routes\horarioAgendamento.routes.ts
import { Router } from "express";
import {
  getHorariosAgendamento,
  getHorarioAgendamentoById,
  createHorarioAgendamento,
  deleteHorarioAgendamento,
} from "../controller/horarioAgendamentoController";

const router = Router();

router.get("/", getHorariosAgendamento);
router.post("/", createHorarioAgendamento);
router.get("/:id", getHorarioAgendamentoById);
router.delete("/:id", deleteHorarioAgendamento);

export default router;
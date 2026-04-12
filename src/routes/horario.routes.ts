import express from "express";
import {
  getHorario,
  getHorarioById,
  createHorario,
  updateHorario,
} from "../controller/horarioController";

const router = express.Router();

router.get("/", getHorario);
router.get("/:id", getHorarioById);
router.post("/", createHorario);
router.put("/:id", updateHorario);

export default router;

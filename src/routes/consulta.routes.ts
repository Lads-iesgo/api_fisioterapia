import express from "express";
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

//Rotas Consulta
router.get("/", authMiddleware, authorize("paciente", "read:any"), getConsulta); // GET /consulta
router.get("/:id", authMiddleware, authorize("paciente", "read:any"), getConsultaById); // GET consulta/:id
router.post("/", authMiddleware, authorize("paciente", "update:any"), createConsulta); // POST /consulta
router.put("/:id", authMiddleware, authorize("paciente", "update:any"), updateConsulta); // PUT /consulta/:id
router.delete("/:id", authMiddleware, authorize("paciente", "delete:any"), deleteConsulta); // DELETE /consulta/:id

export default router;

import express from "express";
import {
  getConsulta,
  getConsultaById,
  createConsulta,
  updateConsulta,
} from "../controller/consultaController";

const router = express.Router();

//Rotas Perfil
router.get("/", getConsulta); // GET /consulta
router.get("/:id", getConsultaById); // GET consulta/:id
router.post("/", createConsulta); // POST /consulta
router.put("/:id", updateConsulta); // PUT /consulta/:id

export default router;

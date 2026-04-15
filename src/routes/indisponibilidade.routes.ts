import express from "express";
import {
  getIndisponibilidade,
  getIndisponibilidadeById,
  createIndisponibilidade,
  updateIndisponibilidade,
  deleteIndisponibilidade
} from "../controller/indisponibilidadeController";
import { checkRole } from "../middleware/rbacMiddleware";

const router = express.Router();

// Leitura liberada para todos os usuários autenticados
router.get("/", getIndisponibilidade);
router.get("/:id", getIndisponibilidadeById);

// Escrita restrita a admin e coordenador
router.post("/", checkRole("admin", "coordenador"), createIndisponibilidade);
router.put("/:id", checkRole("admin", "coordenador"), updateIndisponibilidade);
router.delete("/:id", checkRole("admin", "coordenador"), deleteIndisponibilidade);

export default router;

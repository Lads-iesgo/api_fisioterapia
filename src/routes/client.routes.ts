import express from "express";
import {
  getClients,
  getClientsById,
  createClients,
  updateClients,
} from "../controller/clientController";

const router = express.Router();

//Rotas Clientes
router.get("/", getClients); // GET /api/clients
router.get("/:id", getClientsById); // GET /api/clients/:id
router.post("/", createClients); // POST /api/clients
router.put("/:id", updateClients); // PUT /api/clients/:id

export default router;

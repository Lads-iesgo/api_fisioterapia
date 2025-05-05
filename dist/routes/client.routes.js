"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controller/clientController");
const router = express_1.default.Router();
//Rotas Clientes
router.get("/", clientController_1.getClients); // GET /api/clients
router.post("/:id", clientController_1.getClientsById); // GET /api/clients/:id
router.post("/", clientController_1.createClients); // POST /api/clients
router.put("/:id", clientController_1.updateClients); // PUT /api/clients/:id
exports.default = router;

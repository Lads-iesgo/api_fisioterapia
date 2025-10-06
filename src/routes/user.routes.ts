import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";
import {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  getFisioterapeutas, // Importe a nova função
} from "../controller/userController";

const router = Router();

router.get("/", authMiddleware, authorize("user", "read:any"), getUsers);
router.get("/fisioterapeutas", authMiddleware, authorize("user", "read:any"), getFisioterapeutas); // Nova rota
router.get("/:id", authMiddleware, authorize("user", "read:any"), getUsersById);
router.post("/", authMiddleware, authorize("user", "update:any"), createUser);
router.put("/:id", authMiddleware, authorize("user", "update:any"), updateUser);
// router.delete("/:id", deleteUser); // Se você implementar a deleção

export default router;

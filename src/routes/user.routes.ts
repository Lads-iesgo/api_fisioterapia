import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";
import {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  getFisioterapeutas,
} from "../controller/userController";

const router = Router();

// GET routes accept both read:own (aluno) and read:any (professor, coordenador, admin)
router.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("user", "read:own")(req, res, next);
  } else {
    return authorize("user", "read:any")(req, res, next);
  }
}, getUsers);

router.get("/fisioterapeutas", authMiddleware, authorize("user", "read:any"), getFisioterapeutas);

router.get("/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("user", "read:own")(req, res, next);
  } else {
    return authorize("user", "read:any")(req, res, next);
  }
}, getUsersById);

// POST and PUT only for professor, coordenador, admin
router.post("/", authMiddleware, authorize("user", "update:any"), createUser);
router.put("/:id", authMiddleware, authorize("user", "update:any"), updateUser);

export default router;

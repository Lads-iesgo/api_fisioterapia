"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = __importDefault(require("../middleware/authorize"));
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authMiddleware, (0, authorize_1.default)("user", "read:any"), userController_1.getUsers);
router.get("/fisioterapeutas", authMiddleware_1.authMiddleware, (0, authorize_1.default)("user", "read:any"), userController_1.getFisioterapeutas); // Nova rota
router.get("/:id", authMiddleware_1.authMiddleware, (0, authorize_1.default)("user", "read:any"), userController_1.getUsersById);
router.post("/", authMiddleware_1.authMiddleware, (0, authorize_1.default)("user", "update:any"), userController_1.createUser);
router.put("/:id", authMiddleware_1.authMiddleware, (0, authorize_1.default)("user", "update:any"), userController_1.updateUser);
// router.delete("/:id", deleteUser); // Se você implementar a deleção
exports.default = router;

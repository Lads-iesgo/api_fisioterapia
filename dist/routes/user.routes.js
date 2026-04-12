"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const router = (0, express_1.Router)();
router.get("/", userController_1.getUsers);
router.get("/fisioterapeutas", userController_1.getFisioterapeutas); // Nova rota
router.get("/:id", userController_1.getUsersById);
router.post("/", rbacMiddleware_1.restrictProfessorUserCreation, userController_1.createUser);
router.put("/:id", userController_1.updateUser);
// router.delete("/:id", deleteUser); // Se você implementar a deleção
exports.default = router;

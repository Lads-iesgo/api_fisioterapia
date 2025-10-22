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
// GET routes accept both read:own (aluno) and read:any (professor, coordenador, admin)
router.get("/", authMiddleware_1.authMiddleware, (req, res, next) => {
    var _a;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (role === "aluno") {
        return (0, authorize_1.default)("user", "read:own")(req, res, next);
    }
    else {
        return (0, authorize_1.default)("user", "read:any")(req, res, next);
    }
}, userController_1.getUsers);
router.get("/fisioterapeutas", authMiddleware_1.authMiddleware, (0, authorize_1.default)("user", "read:any"), userController_1.getFisioterapeutas);
router.get("/:id", authMiddleware_1.authMiddleware, (req, res, next) => {
    var _a;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (role === "aluno") {
        return (0, authorize_1.default)("user", "read:own")(req, res, next);
    }
    else {
        return (0, authorize_1.default)("user", "read:any")(req, res, next);
    }
}, userController_1.getUsersById);
// POST and PUT only for professor, coordenador, admin
router.post("/", authMiddleware_1.authMiddleware, (0, authorize_1.default)("user", "update:any"), userController_1.createUser);
router.put("/:id", authMiddleware_1.authMiddleware, (0, authorize_1.default)("user", "update:any"), userController_1.updateUser);
exports.default = router;

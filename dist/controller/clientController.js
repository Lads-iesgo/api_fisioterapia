"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClients = exports.createClients = exports.getClientsById = exports.getClients = void 0;
const dados_json_1 = __importDefault(require("../../dados.json"));
const getClients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(dados_json_1.default);
    }
    catch (error) {
        next(error);
    }
});
exports.getClients = getClients;
const getClientsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const client = dados_json_1.default.find((user) => user.id === id);
        if (!client) {
            res.status(404).json({ message: "Cliente não encontrado" });
            return;
        }
        res.status(200).json(client);
    }
    catch (error) {
        next(error);
    }
});
exports.getClientsById = getClientsById;
const createClients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newClient = Object.assign({ id: dados_json_1.default.length + 1 }, req.body);
        dados_json_1.default.push(newClient);
        res.status(201).json(newClient);
    }
    catch (error) {
        next(error);
    }
});
exports.createClients = createClients;
const updateClients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const index = dados_json_1.default.findIndex((user) => user.id === id);
        if (index === -1) {
            res.status(404).json({ message: "Cliente não encontrado" });
            return;
        }
        dados_json_1.default[index] = Object.assign(Object.assign({}, dados_json_1.default[index]), req.body);
        res.status(200).json(dados_json_1.default[index]);
    }
    catch (error) {
        next(error);
    }
});
exports.updateClients = updateClients;

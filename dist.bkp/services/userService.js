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
exports.writeUsers = exports.readUsers = void 0;
// src/services/userService.ts
const promises_1 = __importDefault(require("fs/promises")); // Usamos a versão baseada em Promises do 'fs'
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, '..', '..', 'db.json');
// Função auxiliar para ler o banco de dados inteiro
const readDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        // Se o arquivo não existir, retorna a estrutura padrão
        return { users: [], receipts: [] };
    }
});
// Função para ler APENAS os usuários
const readUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield readDatabase();
    return db.users || [];
});
exports.readUsers = readUsers;
// Função para escrever a lista de usuários no banco
const writeUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield readDatabase();
    db.users = users; // Atualiza apenas a parte dos usuários
    yield promises_1.default.writeFile(dbPath, JSON.stringify(db, null, 2));
});
exports.writeUsers = writeUsers;

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
exports.writeReceipts = exports.readReceipts = void 0;
// src/services/receiptService.ts
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, '..', '..', 'db.json');
// Função auxiliar (pode ser refatorada para um arquivo comum no futuro)
const readDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        return { users: [], receipts: [] };
    }
});
// Função para ler todos os recibos
const readReceipts = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield readDatabase();
    return db.receipts || [];
});
exports.readReceipts = readReceipts;
// Função para escrever a lista de recibos
const writeReceipts = (receipts) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield readDatabase();
    db.receipts = receipts;
    yield promises_1.default.writeFile(dbPath, JSON.stringify(db, null, 2));
});
exports.writeReceipts = writeReceipts;

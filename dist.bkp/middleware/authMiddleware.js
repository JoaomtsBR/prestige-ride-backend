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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
// Transforme a função em async
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Acesso negado. Nenhum token fornecido." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Verifica se o usuário do token ainda existe no banco de dados
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            // Se o usuário não for encontrado, o token é de um usuário deletado (stale token).
            return res
                .status(401)
                .json({ message: "Token inválido. Usuário não encontrado." });
        }
        // Anexa os dados do usuário (payload do token) à requisição
        req.user = decoded;
        // Passa para a próxima função (a lógica da rota)
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
});
exports.authMiddleware = authMiddleware;

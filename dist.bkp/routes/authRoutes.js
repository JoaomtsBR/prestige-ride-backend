"use strict";
// src/routes/authRoutes.ts
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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }
        const users = yield (0, userService_1.readUsers)();
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ message: 'Este e-mail já está em uso.' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            mustChangePassword: true,
        };
        users.push(newUser);
        yield (0, userService_1.writeUsers)(users);
        return res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        // 1. Validação básica de entrada
        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }
        // 2. Buscar o usuário no nosso "banco de dados"
        const users = yield (0, userService_1.readUsers)();
        const user = users.find(u => u.email === email);
        // 3. Se o usuário não for encontrado, retorne um erro genérico
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // Usamos 401 por segurança
        }
        // 4. Comparar a senha enviada com a senha criptografada salva
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        // 5. Se a senha for válida, gerar o JWT
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('A chave secreta do JWT não foi definida no .env');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, // O que vai dentro do token (payload)
        jwtSecret, // A chave secreta
        { expiresIn: '8h' } // Duração do token
        );
        // 6. Enviar o token E O SINALIZADOR como resposta
        return res.status(200).json({
            token,
            mustChangePassword: (_a = user.mustChangePassword) !== null && _a !== void 0 ? _a : false, // <-- MODIFIQUE A RESPOSTA
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
router.post('/change-password', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Se chegou até aqui, o middleware já validou o token.
    var _a;
    const { newPassword } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Pegamos o ID do usuário que veio do token
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'A nova senha é obrigatória e deve ter pelo menos 6 caracteres.' });
    }
    try {
        const users = yield (0, userService_1.readUsers)();
        // Encontra o índice do usuário na lista
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        // Criptografa a nova senha
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Atualiza a senha do usuário e o sinalizador
        users[userIndex].password = hashedPassword;
        users[userIndex].mustChangePassword = false;
        // Salva a lista de usuários atualizada no arquivo
        yield (0, userService_1.writeUsers)(users);
        return res.status(200).json({ message: 'Senha alterada com sucesso.' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
exports.default = router;

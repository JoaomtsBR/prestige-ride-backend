"use strict";
// src/routes/receiptRoutes.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const authMiddleware_1 = require("../middleware/authMiddleware");
const serialization_1 = require("../lib/serialization");
const router = (0, express_1.Router)();
// Aplica o middleware de autenticação a todas as rotas de recibos
router.use(authMiddleware_1.authMiddleware);
// --- READ (All) ---
// GET /api/receipts - Obter todos os recibos do usuário logado
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const receipts = yield prisma_1.prisma.receipt.findMany({
            where: { createdById: userId },
            orderBy: { createdAt: "desc" },
            // Inclui todos os dados relacionados para uma resposta completa ao frontend
            include: {
                services: {
                    include: {
                        route: true,
                        driver: true,
                        expense: true,
                    },
                },
            },
        });
        const serializedReceipts = (0, serialization_1.convertDecimalsToNumbers)(receipts);
        res.status(200).json(serializedReceipts);
    }
    catch (error) {
        console.error("Erro ao buscar recibos:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Erro ao buscar recibos." });
        }
    }
}));
// --- READ (One) ---
// GET /api/receipts/:id - Obter um recibo específico
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const receiptId = parseInt(req.params.id, 10);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // A cláusula where garante que o usuário só pode acessar seus próprios recibos
        const receipt = yield prisma_1.prisma.receipt.findFirst({
            where: { id: receiptId, createdById: userId },
            include: {
                services: { include: { route: true, driver: true, expense: true } },
            },
        });
        if (!receipt) {
            return res
                .status(404)
                .json({ message: "Recibo não encontrado ou acesso negado." });
        }
        const serializedReceipt = (0, serialization_1.convertDecimalsToNumbers)(receipt);
        res.status(200).json(serializedReceipt);
    }
    catch (error) {
        console.error("Erro ao buscar recibo:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Erro ao buscar recibo." });
        }
    }
}));
// --- CREATE (Special Operation) ---
// POST /api/receipts/generate - Gerar um recibo a partir de serviços existentes
router.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        const _b = req.body, { serviceIds } = _b, receiptData = __rest(_b, ["serviceIds"]);
        if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
            return res.status(400).json({
                message: 'O campo "serviceIds" é obrigatório e deve ser um array de IDs.',
            });
        }
        const generatedReceipt = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Valida se todos os serviços existem e estão "livres" (sem recibo)
            const servicesToLink = yield tx.service.findMany({
                where: {
                    id: { in: serviceIds },
                    receiptId: null,
                },
            });
            // Se a contagem de serviços encontrados não bate com a de IDs enviados, algo está errado
            if (servicesToLink.length !== serviceIds.length) {
                throw new Error("Um ou mais serviços não foram encontrados ou já pertencem a outro recibo.");
            }
            // 2. Calcula o grandTotal a partir dos serviços encontrados
            const grandTotal = servicesToLink.reduce((sum, service) => {
                return sum.plus(service.total); // Usa .plus() para somar Decimals corretamente
            }, new client_1.Prisma.Decimal(0));
            // 3. Cria o recibo principal com os dados e o total calculado
            const receipt = yield tx.receipt.create({
                data: Object.assign(Object.assign({}, receiptData), { date: new Date(receiptData.date), grandTotal: grandTotal, createdById: userId }),
            });
            // 4. Atualiza todos os serviços para vinculá-los ao novo recibo
            yield tx.service.updateMany({
                where: { id: { in: serviceIds } },
                data: { receiptId: receipt.id },
            });
            return receipt;
        }));
        const serializedReceipt = (0, serialization_1.convertDecimalsToNumbers)(generatedReceipt);
        res.status(201).json(serializedReceipt);
    }
    catch (error) {
        console.error("Erro ao gerar recibo:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Erro ao gerar recibo." });
        }
    }
}));
// --- UPDATE ---
// PUT /api/receipts/:id - Atualizar os dados de um recibo
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const receiptId = parseInt(req.params.id, 10);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // Ignora o campo 'services' para evitar manipulação indevida nesta rota
        const _b = req.body, { services } = _b, receiptUpdates = __rest(_b, ["services"]);
        const receipt = yield prisma_1.prisma.receipt.findFirst({
            where: { id: receiptId, createdById: userId },
        });
        if (!receipt) {
            return res
                .status(404)
                .json({ message: "Recibo não encontrado ou acesso negado." });
        }
        if (receiptUpdates.date) {
            receiptUpdates.date = new Date(receiptUpdates.date);
        }
        // ATENÇÃO: Esta rota não recalcula o grandTotal. Ela apenas atualiza os metadados do recibo.
        const updatedReceiptData = yield prisma_1.prisma.receipt.update({
            where: { id: receiptId },
            data: receiptUpdates,
        });
        const serializedReceipt = (0, serialization_1.convertDecimalsToNumbers)(updatedReceiptData);
        res.status(200).json(serializedReceipt);
    }
    catch (error) {
        console.error("Erro ao atualizar recibo:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Erro ao atualizar recibo." });
        }
    }
}));
// --- DELETE ---
// DELETE /api/receipts/:id - Deletar um recibo
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const receiptId = parseInt(req.params.id, 10);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const receipt = yield prisma_1.prisma.receipt.findFirst({
            where: { id: receiptId, createdById: userId },
        });
        if (!receipt) {
            return res
                .status(404)
                .json({ message: "Recibo não encontrado ou acesso negado." });
        }
        // Usar transaction para garantir atomicidade
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Primeiro, desvincular todos os serviços do recibo
            yield tx.service.updateMany({
                where: { receiptId: receiptId },
                data: { receiptId: null },
            });
            // 2. Depois deletar o recibo
            yield tx.receipt.delete({ where: { id: receiptId } });
        }));
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar recibo:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Erro ao deletar recibo." });
        }
    }
}));
exports.default = router;

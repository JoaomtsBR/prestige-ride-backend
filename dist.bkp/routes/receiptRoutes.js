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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/receiptRoutes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const receiptService_1 = require("../services/receiptService");
const router = (0, express_1.Router)();
// Aplica o middleware de autenticação a todas as rotas deste arquivo.
// Isso garante que apenas usuários logados possam acessar os endpoints de recibos.
router.use(authMiddleware_1.authMiddleware);
// -----------------------------------------------------------------------------
// MÉTODO GET: Obter todos os recibos (Read)
// -----------------------------------------------------------------------------
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receipts = yield (0, receiptService_1.readReceipts)();
        res.status(200).json(receipts);
    }
    catch (error) {
        console.error('Erro ao buscar recibos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar recibos.' });
    }
}));
// -----------------------------------------------------------------------------
// MÉTODO POST: Criar um novo recibo (Create)
// -----------------------------------------------------------------------------
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Pega os dados do corpo da requisição
        const newReceiptData = req.body;
        // Pega o ID do usuário que está logado (adicionado pelo authMiddleware)
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado corretamente.' });
        }
        // Lê os recibos existentes
        const receipts = yield (0, receiptService_1.readReceipts)();
        // Cria o objeto completo do novo recibo
        const newReceipt = Object.assign(Object.assign({}, newReceiptData), { id: Date.now(), createdAt: new Date(), createdBy: userId });
        // Adiciona o novo recibo à lista
        receipts.push(newReceipt);
        // Salva a lista atualizada no arquivo
        yield (0, receiptService_1.writeReceipts)(receipts);
        // Retorna o recibo criado com o status 201 (Created)
        res.status(201).json(newReceipt);
    }
    catch (error) {
        console.error('Erro ao criar recibo:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar recibo.' });
    }
}));
// -----------------------------------------------------------------------------
// MÉTODO PUT: Atualizar um recibo existente (Update)
// -----------------------------------------------------------------------------
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiptId = parseInt(req.params.id, 10);
        const updates = req.body;
        const receipts = yield (0, receiptService_1.readReceipts)();
        const receiptIndex = receipts.findIndex(r => r.id === receiptId);
        if (receiptIndex === -1) {
            return res.status(404).json({ message: 'Recibo não encontrado.' });
        }
        // Combina o recibo antigo com as atualizações, garantindo que o ID e a data de criação não mudem
        receipts[receiptIndex] = Object.assign(Object.assign({}, receipts[receiptIndex]), updates);
        yield (0, receiptService_1.writeReceipts)(receipts);
        res.status(200).json(receipts[receiptIndex]);
    }
    catch (error) {
        console.error('Erro ao atualizar recibo:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar recibo.' });
    }
}));
// -----------------------------------------------------------------------------
// MÉTODO DELETE: Deletar um recibo (Delete)
// -----------------------------------------------------------------------------
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiptId = parseInt(req.params.id, 10);
        const receipts = yield (0, receiptService_1.readReceipts)();
        const updatedReceipts = receipts.filter(r => r.id !== receiptId);
        // Verifica se algum item foi realmente removido
        if (receipts.length === updatedReceipts.length) {
            return res.status(404).json({ message: 'Recibo não encontrado.' });
        }
        yield (0, receiptService_1.writeReceipts)(updatedReceipts);
        // Retorna 204 (No Content), indicando sucesso na exclusão sem enviar dados de volta
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar recibo:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao deletar recibo.' });
    }
}));
exports.default = router;

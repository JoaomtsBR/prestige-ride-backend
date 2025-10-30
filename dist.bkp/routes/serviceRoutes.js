"use strict";
// src/routes/serviceRoutes.ts
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
exports.serviceRoutes = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const authMiddleware_1 = require("../middleware/authMiddleware");
const serialization_1 = require("../lib/serialization");
exports.serviceRoutes = (0, express_1.Router)();
// Aplica o middleware de autenticação a todas as rotas neste arquivo
exports.serviceRoutes.use(authMiddleware_1.authMiddleware);
// CREATE: Rota para criar um serviço de forma independente
exports.serviceRoutes.post("/services", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceDate, transfer, extras, total, routeId, driverId, expense } = req.body;
        if (!routeId || !driverId || !serviceDate) {
            return res.status(400).json({
                message: "Os campos routeId, driverId e serviceDate são obrigatórios.",
            });
        }
        // Calcule o total automaticamente
        const calculatedTotal = (transfer || 0) + (extras || 0);
        const newService = yield prisma_1.prisma.service.create({
            data: {
                serviceDate: new Date(serviceDate),
                transfer,
                extras,
                total: calculatedTotal,
                route: { connect: { id: routeId } },
                driver: { connect: { id: driverId } },
                expense: { create: expense || {} },
                receipt: undefined, // or set to null if you want no receipt on creation
            },
            include: { route: true, driver: true, expense: true },
        });
        const serializedService = (0, serialization_1.convertDecimalsToNumbers)(newService);
        return res.status(201).json(serializedService);
    }
    catch (error) {
        console.error("Falha ao criar serviço:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Falha ao criar serviço." });
    }
}));
// READ (All services for the user, with filtering) - VERSÃO CORRIGIDA
exports.serviceRoutes.get("/services", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { status } = req.query;
        let where;
        if (status === "unreceipted") {
            // Filtro específico para serviços SEM recibo.
            // TODO: Adicionar um 'createdById' ao serviço para segurança real.
            where = { receiptId: null };
        }
        else if (status === "receipted") {
            // Filtro específico para serviços COM recibo do usuário.
            where = {
                receipt: { createdById: userId },
            };
        }
        else {
            // CASO PADRÃO (sem filtro): Mostra serviços que OU não têm recibo OU pertencem ao usuário.
            // Esta é a mudança principal.
            where = {
                OR: [
                    { receiptId: null }, // Mostra os serviços "livres"
                    { receipt: { createdById: userId } }, // Mostra os serviços já associados ao usuário
                ],
            };
        }
        const services = yield prisma_1.prisma.service.findMany({
            where: where,
            orderBy: { serviceDate: "desc" },
            include: {
                route: true,
                driver: true,
                expense: true,
                receipt: { select: { id: true, number: true, clientName: true } },
            },
        });
        const serializedServices = (0, serialization_1.convertDecimalsToNumbers)(services);
        res.status(200).json(serializedServices);
    }
    catch (error) {
        console.error("Erro ao buscar serviços:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Erro ao buscar serviços." });
        }
    }
}));
// READ (One service)
exports.serviceRoutes.get("/services/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const serviceId = parseInt(req.params.id, 10);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const service = yield prisma_1.prisma.service.findFirst({
            where: {
                id: serviceId,
                OR: [{ receiptId: null }, { receipt: { createdById: userId } }],
            },
            include: { route: true, driver: true, expense: true },
        });
        if (!service) {
            return res
                .status(404)
                .json({ message: "Serviço não encontrado ou acesso negado." });
        }
        const serializedService = (0, serialization_1.convertDecimalsToNumbers)(service);
        return res.json(serializedService);
    }
    catch (error) {
        console.error("Falha ao buscar serviço:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Falha ao buscar serviço." });
    }
}));
// UPDATE (a service)
exports.serviceRoutes.put("/services/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const serviceId = parseInt(req.params.id, 10);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { serviceDate, transfer, extras, total, routeId, driverId, expense } = req.body;
        const existingService = yield prisma_1.prisma.service.findFirst({
            where: {
                id: serviceId,
                OR: [{ receiptId: null }, { receipt: { createdById: userId } }],
            },
        });
        if (!existingService) {
            return res
                .status(404)
                .json({ message: "Serviço não encontrado ou acesso negado." });
        }
        const finalTransfer = transfer !== undefined ? transfer : existingService.transfer;
        const finalExtras = extras !== undefined ? extras : existingService.extras;
        const calculatedTotal = (finalTransfer || 0) + (finalExtras || 0);
        const updatedService = yield prisma_1.prisma.service.update({
            where: { id: serviceId },
            data: {
                serviceDate: serviceDate ? new Date(serviceDate) : undefined,
                transfer: finalTransfer,
                extras: finalExtras,
                total: calculatedTotal,
                routeId,
                driverId,
                expense: { upsert: { create: expense || {}, update: expense || {} } },
            },
        });
        const serializedService = (0, serialization_1.convertDecimalsToNumbers)(updatedService);
        return res.json(serializedService);
    }
    catch (error) {
        console.error("Falha ao atualizar serviço:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Falha ao atualizar serviço." });
    }
}));
// DELETE (a service)
exports.serviceRoutes.delete("/services/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const serviceId = parseInt(req.params.id, 10);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const service = yield prisma_1.prisma.service.findFirst({
            where: {
                id: serviceId,
                OR: [{ receiptId: null }, { receipt: { createdById: userId } }],
            },
        });
        if (!service) {
            return res
                .status(404)
                .json({ message: "Serviço não encontrado ou acesso negado." });
        }
        yield prisma_1.prisma.service.delete({ where: { id: serviceId } });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Falha ao deletar serviço:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Falha ao deletar serviço." });
    }
}));

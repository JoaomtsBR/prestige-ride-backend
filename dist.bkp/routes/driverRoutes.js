"use strict";
// src/routes/driverRoutes.ts
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
exports.driverRoutes = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.driverRoutes = (0, express_1.Router)();
// CREATE
exports.driverRoutes.post("/drivers", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        const driver = yield prisma_1.prisma.driver.create({ data: { name } });
        return res.status(201).json(driver);
    }
    catch (error) {
        console.error("Failed to create driver:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to create driver" });
    }
}));
// READ (All)
exports.driverRoutes.get("/drivers", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drivers = yield prisma_1.prisma.driver.findMany({
            orderBy: { name: "asc" },
        });
        return res.json(drivers);
    }
    catch (error) {
        console.error("Failed to fetch drivers:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to fetch drivers" });
    }
}));
// READ (One)
exports.driverRoutes.get("/drivers/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driverId = parseInt(req.params.id, 10);
        const driver = yield prisma_1.prisma.driver.findUnique({
            where: { id: driverId },
        });
        if (!driver) {
            return res.status(404).json({ message: "Driver not found." });
        }
        return res.json(driver);
    }
    catch (error) {
        console.error("Failed to fetch driver:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to fetch driver." });
    }
}));
// UPDATE
exports.driverRoutes.put("/drivers/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driverId = parseInt(req.params.id, 10);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        const updatedDriver = yield prisma_1.prisma.driver.update({
            where: { id: driverId },
            data: { name },
        });
        return res.json(updatedDriver);
    }
    catch (error) {
        console.error("Failed to update driver:", error);
        // Prisma lança um erro específico se o registro não for encontrado (P2025)
        if (error instanceof Error && error.code === "P2025") {
            return res.status(404).json({ message: "Driver not found." });
        }
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to update driver." });
    }
}));
// DELETE
exports.driverRoutes.delete("/drivers/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driverId = parseInt(req.params.id, 10);
        yield prisma_1.prisma.driver.delete({
            where: { id: driverId },
        });
        return res.status(204).send(); // 204 No Content é a resposta padrão para sucesso em DELETE
    }
    catch (error) {
        console.error("Failed to delete driver:", error);
        if (error instanceof Error && error.code === "P2025") {
            return res.status(404).json({ message: "Driver not found." });
        }
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to delete driver." });
    }
}));

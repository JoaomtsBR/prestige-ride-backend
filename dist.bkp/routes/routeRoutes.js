"use strict";
// src/routes/routeRoutes.ts
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
exports.routeRoutes = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const authMiddleware_1 = require("../middleware/authMiddleware");
const serialization_1 = require("../lib/serialization");
exports.routeRoutes = (0, express_1.Router)();
// CREATE
exports.routeRoutes.post("/routes", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { origin, destination, tollCost, mileage, direction } = req.body;
        if (!origin || !destination) {
            return res
                .status(400)
                .json({ error: "Origin and destination are required" });
        }
        const route = yield prisma_1.prisma.route.create({
            data: { origin, destination, tollCost, mileage, direction },
        });
        const serializedRoute = (0, serialization_1.convertDecimalsToNumbers)(route);
        return res.status(201).json(serializedRoute);
    }
    catch (error) {
        console.error("Failed to create route:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to create route" });
    }
}));
// READ (All)
exports.routeRoutes.get("/routes", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const routes = yield prisma_1.prisma.route.findMany({
            orderBy: [{ origin: "asc" }, { destination: "asc" }],
        });
        const serializedRoutes = (0, serialization_1.convertDecimalsToNumbers)(routes);
        return res.json(serializedRoutes);
    }
    catch (error) {
        console.error("Failed to fetch routes:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to fetch routes" });
    }
}));
// READ (One)
exports.routeRoutes.get("/routes/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const routeId = parseInt(req.params.id, 10);
        const route = yield prisma_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            return res.status(404).json({ message: "Route not found." });
        }
        const serializedRoute = (0, serialization_1.convertDecimalsToNumbers)(route);
        return res.json(serializedRoute);
    }
    catch (error) {
        console.error("Failed to fetch route:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to fetch route." });
    }
}));
// UPDATE
exports.routeRoutes.put("/routes/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const routeId = parseInt(req.params.id, 10);
        const { origin, destination, tollCost, mileage, direction } = req.body;
        const updatedRoute = yield prisma_1.prisma.route.update({
            where: { id: routeId },
            data: { origin, destination, tollCost, mileage, direction },
        });
        const serializedRoute = (0, serialization_1.convertDecimalsToNumbers)(updatedRoute);
        return res.json(serializedRoute);
    }
    catch (error) {
        console.error("Failed to update route:", error);
        if (error instanceof Error && error.code === "P2025") {
            return res.status(404).json({ message: "Route not found." });
        }
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to update route." });
    }
}));
// DELETE
exports.routeRoutes.delete("/routes/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const routeId = parseInt(req.params.id, 10);
        yield prisma_1.prisma.route.delete({
            where: { id: routeId },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Failed to delete route:", error);
        if (error instanceof Error && error.code === "P2025") {
            return res.status(404).json({ message: "Route not found." });
        }
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Failed to delete route." });
    }
}));

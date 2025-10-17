// src/routes/driverRoutes.ts

import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";

export const driverRoutes = Router();

// CREATE
driverRoutes.post(
  "/drivers",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      const driver = await prisma.driver.create({ data: { name } });
      return res.status(201).json(driver);
    } catch (error) {
      console.error("Failed to create driver:", error);
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to create driver" });
    }
  }
);

// READ (All)
driverRoutes.get(
  "/drivers",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const drivers = await prisma.driver.findMany({
        orderBy: { name: "asc" },
      });
      return res.json(drivers);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to fetch drivers" });
    }
  }
);

// READ (One)
driverRoutes.get(
  "/drivers/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const driverId = parseInt(req.params.id, 10);
      const driver = await prisma.driver.findUnique({
        where: { id: driverId },
      });
      if (!driver) {
        return res.status(404).json({ message: "Driver not found." });
      }
      return res.json(driver);
    } catch (error) {
      console.error("Failed to fetch driver:", error);
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to fetch driver." });
    }
  }
);

// UPDATE
driverRoutes.put(
  "/drivers/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const driverId = parseInt(req.params.id, 10);
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      const updatedDriver = await prisma.driver.update({
        where: { id: driverId },
        data: { name },
      });
      return res.json(updatedDriver);
    } catch (error) {
      console.error("Failed to update driver:", error);
      // Prisma lança um erro específico se o registro não for encontrado (P2025)
      if (error instanceof Error && (error as any).code === "P2025") {
        return res.status(404).json({ message: "Driver not found." });
      }
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to update driver." });
    }
  }
);

// DELETE
driverRoutes.delete(
  "/drivers/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const driverId = parseInt(req.params.id, 10);
      await prisma.driver.delete({
        where: { id: driverId },
      });
      return res.status(204).send(); // 204 No Content é a resposta padrão para sucesso em DELETE
    } catch (error) {
      console.error("Failed to delete driver:", error);
      if (error instanceof Error && (error as any).code === "P2025") {
        return res.status(404).json({ message: "Driver not found." });
      }
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to delete driver." });
    }
  }
);

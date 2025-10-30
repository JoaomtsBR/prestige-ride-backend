// src/routes/routeRoutes.ts

import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";
import { convertDecimalsToNumbers } from "../lib/serialization";

export const routeRoutes = Router();

// CREATE
routeRoutes.post(
  "/routes",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { origin, destination, tollCost, mileage, direction } = req.body;
      if (!origin || !destination) {
        return res
          .status(400)
          .json({ error: "Origin and destination are required" });
      }
      const route = await prisma.route.create({
        data: { origin, destination, tollCost, mileage, direction },
      });
      const serializedRoute = convertDecimalsToNumbers(route);
      return res.status(201).json(serializedRoute);
    } catch (error) {
      console.error("Failed to create route:", error);
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to create route" });
    }
  }
);

// READ (All)
routeRoutes.get(
  "/routes",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const routes = await prisma.route.findMany({
        orderBy: [{ origin: "asc" }, { destination: "asc" }],
      });
      const serializedRoutes = convertDecimalsToNumbers(routes);
      return res.json(serializedRoutes);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to fetch routes" });
    }
  }
);

// READ (One)
routeRoutes.get(
  "/routes/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const routeId = parseInt(req.params.id, 10);
      const route = await prisma.route.findUnique({
        where: { id: routeId },
      });
      if (!route) {
        return res.status(404).json({ message: "Route not found." });
      }
      const serializedRoute = convertDecimalsToNumbers(route);
      return res.json(serializedRoute);
    } catch (error) {
      console.error("Failed to fetch route:", error);
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to fetch route." });
    }
  }
);

// UPDATE
routeRoutes.put(
  "/routes/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const routeId = parseInt(req.params.id, 10);
      const { origin, destination, tollCost, mileage, direction } = req.body;
      const updatedRoute = await prisma.route.update({
        where: { id: routeId },
        data: { origin, destination, tollCost, mileage, direction },
      });
      const serializedRoute = convertDecimalsToNumbers(updatedRoute);
      return res.json(serializedRoute);
    } catch (error) {
      console.error("Failed to update route:", error);
      if (error instanceof Error && (error as any).code === "P2025") {
        return res.status(404).json({ message: "Route not found." });
      }
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to update route." });
    }
  }
);

// DELETE
routeRoutes.delete(
  "/routes/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const routeId = parseInt(req.params.id, 10);
      await prisma.route.delete({
        where: { id: routeId },
      });
      return res.status(204).send();
    } catch (error) {
      console.error("Failed to delete route:", error);
      if (error instanceof Error && (error as any).code === "P2025") {
        return res.status(404).json({ message: "Route not found." });
      }
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to delete route." });
    }
  }
);

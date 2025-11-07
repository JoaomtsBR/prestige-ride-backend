// src/routes/serviceRoutes.ts

import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";
import { convertDecimalsToNumbers } from "../lib/serialization";
import { Prisma } from "@prisma/client";

export const serviceRoutes = Router();

// Aplica o middleware de autenticação a todas as rotas neste arquivo
serviceRoutes.use(authMiddleware);

// CREATE: Rota para criar um serviço de forma independente
serviceRoutes.post("/services", async (req: Request, res: Response) => {
  try {
    // --- ALTERAÇÃO: Adicionado passengerTransported ---
    const {
      serviceDate,
      transfer,
      extras,
      total,
      routeId,
      driverId,
      expense,
      passengerTransported,
    } = req.body;

    if (!routeId || !driverId || !serviceDate) {
      return res.status(400).json({
        message: "Os campos routeId, driverId e serviceDate são obrigatórios.",
      });
    }

    // Calcule o total automaticamente
    const calculatedTotal = (transfer || 0) + (extras || 0);

    const newService = await prisma.service.create({
      data: {
        serviceDate: new Date(serviceDate),
        passengerTransported,
        transfer,
        extras,
        total: calculatedTotal,
        route: { connect: { id: routeId } },
        driver: { connect: { id: driverId } },
        expense: { create: expense || {} },
        receipt: undefined,
      },
      include: { route: true, driver: true, expense: true },
    });

    const serializedService = convertDecimalsToNumbers(newService);
    return res.status(201).json(serializedService);
  } catch (error) {
    console.error("Falha ao criar serviço:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Falha ao criar serviço." });
  }
});

// READ (All services for the user, with filtering)
serviceRoutes.get("/services", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { status } = req.query;

    let where: Prisma.ServiceWhereInput;

    if (status === "unreceipted") {
      where = { receiptId: null };
    } else if (status === "receipted") {
      where = {
        receipt: { createdById: userId },
      };
    } else {
      where = {
        OR: [
          { receiptId: null },
          { receipt: { createdById: userId } },
        ],
      };
    }

    const services = await prisma.service.findMany({
      where: where,
      orderBy: { serviceDate: "desc" },
      include: {
        route: true,
        driver: true,
        expense: true,
        receipt: { select: { id: true, number: true, clientName: true } },
      },
    });

    const serializedServices = convertDecimalsToNumbers(services);
    res.status(200).json(serializedServices);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao buscar serviços." });
    }
  }
});

// READ (One service)
serviceRoutes.get("/services/:id", async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;
    const service = await prisma.service.findFirst({
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
    const serializedService = convertDecimalsToNumbers(service);
    return res.json(serializedService);
  } catch (error) {
    console.error("Falha ao buscar serviço:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Falha ao buscar serviço." });
  }
});

// UPDATE (a service)
serviceRoutes.put("/services/:id", async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;
    // --- ALTERAÇÃO: Adicionado passengerTransported ---
    const {
      serviceDate,
      transfer,
      extras,
      total,
      routeId,
      driverId,
      expense,
      passengerTransported,
    } = req.body;

    const existingService = await prisma.service.findFirst({
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

    const finalTransfer =
      transfer !== undefined ? transfer : existingService.transfer;
    const finalExtras = extras !== undefined ? extras : existingService.extras;
    const calculatedTotal = (finalTransfer || 0) + (finalExtras || 0);

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        serviceDate: serviceDate ? new Date(serviceDate) : undefined,
        passengerTransported,
        transfer: finalTransfer,
        extras: finalExtras,
        total: calculatedTotal,
        routeId,
        driverId,
        expense: { upsert: { create: expense || {}, update: expense || {} } },
      },
    });
    const serializedService = convertDecimalsToNumbers(updatedService);
    return res.json(serializedService);
  } catch (error) {
    console.error("Falha ao atualizar serviço:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Falha ao atualizar serviço." });
  }
});

// DELETE (a service)
serviceRoutes.delete("/services/:id", async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;
    const service = await prisma.service.findFirst({
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
    await prisma.service.delete({ where: { id: serviceId } });
    return res.status(204).send();
  } catch (error) {
    console.error("Falha ao deletar serviço:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Falha ao deletar serviço." });
  }
});
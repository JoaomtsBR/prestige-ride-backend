// src/routes/receiptRoutes.ts

import { Router, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";
import { convertDecimalsToNumbers } from "../lib/serialization";

const router = Router();
// Aplica o middleware de autenticação a todas as rotas de recibos
router.use(authMiddleware);

// --- READ (All) ---
// GET /api/receipts - Obter todos os recibos do usuário logado
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const receipts = await prisma.receipt.findMany({
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

    const serializedReceipts = convertDecimalsToNumbers(receipts);
    res.status(200).json(serializedReceipts);
  } catch (error) {
    console.error("Erro ao buscar recibos:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao buscar recibos." });
    }
  }
});

// --- READ (One) ---
// GET /api/receipts/:id - Obter um recibo específico
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const receiptId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;

    // A cláusula where garante que o usuário só pode acessar seus próprios recibos
    const receipt = await prisma.receipt.findFirst({
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

    const serializedReceipt = convertDecimalsToNumbers(receipt);
    res.status(200).json(serializedReceipt);
  } catch (error) {
    console.error("Erro ao buscar recibo:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao buscar recibo." });
    }
  }
});

// --- CREATE (Special Operation) ---
// POST /api/receipts/generate - Gerar um recibo a partir de serviços existentes
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // 1. Extraímos o 'grandTotal' do corpo para decidir se usamos ele ou calculamos
    const { serviceIds, includePassengers, grandTotal, ...receiptData } = req.body;

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({
        message: 'O campo "serviceIds" é obrigatório e deve ser um array de IDs.',
      });
    }

    const generatedReceipt = await prisma.$transaction(async (tx) => {
      // Valida se todos os serviços existem e estão "livres"
      const servicesToLink = await tx.service.findMany({
        where: {
          id: { in: serviceIds },
          receiptId: null,
        },
      });

      if (servicesToLink.length !== serviceIds.length) {
        throw new Error(
          "Um ou mais serviços não foram encontrados ou já pertencem a outro recibo."
        );
      }

      // --- LÓGICA DE CÁLCULO DO TOTAL (ALTERADA) ---
      let finalGrandTotal: Prisma.Decimal;

      // Se o grandTotal veio do front-end (foi editado manualmente), usamos ele.
      if (grandTotal !== undefined && grandTotal !== null) {
        finalGrandTotal = new Prisma.Decimal(grandTotal);
      } else {
        // Caso contrário, calculamos a soma dos serviços automaticamente
        finalGrandTotal = servicesToLink.reduce((sum, service) => {
          return sum.plus(service.total);
        }, new Prisma.Decimal(0));
      }
      // ---------------------------------------------

      // Cria o recibo principal
      const receipt = await tx.receipt.create({
        data: {
          ...receiptData,
          date: new Date(receiptData.date),
          grandTotal: finalGrandTotal, // Usa o valor decidido acima
          createdById: userId,
        },
      });

      // Atualiza os serviços vinculados
      await tx.service.updateMany({
        where: { id: { in: serviceIds } },
        data: { receiptId: receipt.id },
      });

      return receipt;
    });

    const serializedReceipt = convertDecimalsToNumbers(generatedReceipt);
    res.status(201).json(serializedReceipt);
  } catch (error) {
    console.error("Erro ao gerar recibo:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao gerar recibo." });
    }
  }
});

// --- UPDATE ---
// PUT /api/receipts/:id - Atualizar os dados de um recibo
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const receiptId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;
    // Ignora o campo 'services' para evitar manipulação indevida nesta rota
    const { services, ...receiptUpdates } = req.body;

    const receipt = await prisma.receipt.findFirst({
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
    const updatedReceiptData = await prisma.receipt.update({
      where: { id: receiptId },
      data: receiptUpdates,
    });

    const serializedReceipt = convertDecimalsToNumbers(updatedReceiptData);
    res.status(200).json(serializedReceipt);
  } catch (error) {
    console.error("Erro ao atualizar recibo:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao atualizar recibo." });
    }
  }
});

// --- DELETE ---
// DELETE /api/receipts/:id - Deletar um recibo
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const receiptId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;

    const receipt = await prisma.receipt.findFirst({
      where: { id: receiptId, createdById: userId },
    });

    if (!receipt) {
      return res
        .status(404)
        .json({ message: "Recibo não encontrado ou acesso negado." });
    }

    // Usar transaction para garantir atomicidade
    await prisma.$transaction(async (tx) => {
      // 1. Primeiro, desvincular todos os serviços do recibo
      await tx.service.updateMany({
        where: { receiptId: receiptId },
        data: { receiptId: null },
      });

      // 2. Depois deletar o recibo
      await tx.receipt.delete({ where: { id: receiptId } });
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar recibo:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao deletar recibo." });
    }
  }
});

export default router;

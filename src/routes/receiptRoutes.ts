// src/routes/receiptRoutes.ts (VERSÃO ATUALIZADA COM PRISMA)
import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // <-- Importa o Prisma Client
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

// GET /api/receipts - Obter todos os recibos do usuário logado
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const receipts = await prisma.receipt.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'desc' }, // Ordena os mais recentes primeiro
    });
    res.status(200).json(receipts);
  } catch (error) {
    console.error("Erro ao buscar recibos:", error);
    res.status(500).json({ message: 'Erro ao buscar recibos.' });
  }
});

// POST /api/receipts - Criar um novo recibo
router.post('/', async (req: Request, res: Response) => {
  try {
    const receiptData = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const newReceipt = await prisma.receipt.create({
      data: {
        ...receiptData,
        date: new Date(receiptData.date), // Garante que a data seja um objeto Date
        createdById: userId, // Associa o recibo ao usuário logado
      },
    });
    res.status(201).json(newReceipt);
  } catch (error) {
    console.error("Erro ao criar recibo:", error);
    res.status(500).json({ message: 'Erro ao criar recibo.' });
  }
});

// PUT /api/receipts/:id - Atualizar um recibo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const receiptId = parseInt(req.params.id, 10);
    const updates = req.body;

    // Converte a data principal, se ela existir
    if (updates.date && typeof updates.date === 'string') {
      updates.date = new Date(updates.date);
    }

    // Converte as datas DENTRO do array de serviços, se ele existir
    if (updates.services && Array.isArray(updates.services)) {
      updates.services = updates.services.map((service: any) => ({
        ...service,
        // Garante que serviceDate seja um objeto Date antes de salvar
        serviceDate: service.serviceDate ? new Date(service.serviceDate) : new Date(),
      }));
    }


    // Lógica de segurança para garantir que o usuário é o "dono" do recibo
    const receipt = await prisma.receipt.findFirst({
      where: { id: receiptId, createdById: req.user?.userId }
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Recibo não encontrado ou acesso negado.' });
    }

    const updatedReceipt = await prisma.receipt.update({
      where: { id: receiptId },
      data: updates, // 'updates' agora tem todas as datas no formato correto
    });
    res.status(200).json(updatedReceipt);
  } catch (error) {
    console.error("Erro ao atualizar recibo:", error);
    res.status(500).json({ message: 'Erro ao atualizar recibo.' });
  }
});

// DELETE /api/receipts/:id - Deletar um recibo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const receiptId = parseInt(req.params.id, 10);

    // Garante que o usuário só possa deletar seus próprios recibos
    const receipt = await prisma.receipt.findFirst({
      where: { id: receiptId, createdById: req.user?.userId }
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Recibo não encontrado ou acesso negado.' });
    }

    await prisma.receipt.delete({ where: { id: receiptId } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar recibo:", error);
    res.status(500).json({ message: 'Erro ao deletar recibo.' });
  }
});

export default router;
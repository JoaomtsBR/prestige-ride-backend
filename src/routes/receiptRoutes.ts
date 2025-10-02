// src/routes/receiptRoutes.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { readReceipts, writeReceipts, Receipt } from '../services/receiptService';

const router = Router();

// Aplica o middleware de autenticação a todas as rotas deste arquivo.
// Isso garante que apenas usuários logados possam acessar os endpoints de recibos.
router.use(authMiddleware);

// -----------------------------------------------------------------------------
// MÉTODO GET: Obter todos os recibos (Read)
// -----------------------------------------------------------------------------
router.get('/', async (req: Request, res: Response) => {
  try {
    const receipts = await readReceipts();
    res.status(200).json(receipts);
  } catch (error) {
    console.error('Erro ao buscar recibos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar recibos.' });
  }
});

// -----------------------------------------------------------------------------
// MÉTODO POST: Criar um novo recibo (Create)
// -----------------------------------------------------------------------------
router.post('/', async (req: Request, res: Response) => {
  try {
    // Pega os dados do corpo da requisição
    const newReceiptData = req.body;
    // Pega o ID do usuário que está logado (adicionado pelo authMiddleware)
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado corretamente.' });
    }

    // Lê os recibos existentes
    const receipts = await readReceipts();
    
    // Cria o objeto completo do novo recibo
    const newReceipt: Receipt = {
      ...newReceiptData,
      id: Date.now(), // Gera um ID simples baseado no timestamp
      createdAt: new Date(),
      createdBy: userId,
    };

    // Adiciona o novo recibo à lista
    receipts.push(newReceipt);
    
    // Salva a lista atualizada no arquivo
    await writeReceipts(receipts);

    // Retorna o recibo criado com o status 201 (Created)
    res.status(201).json(newReceipt);

  } catch (error) {
    console.error('Erro ao criar recibo:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar recibo.' });
  }
});

// -----------------------------------------------------------------------------
// MÉTODO PUT: Atualizar um recibo existente (Update)
// -----------------------------------------------------------------------------
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const receiptId = parseInt(req.params.id, 10);
    const updates = req.body;
    
    const receipts = await readReceipts();
    const receiptIndex = receipts.findIndex(r => r.id === receiptId);

    if (receiptIndex === -1) {
      return res.status(404).json({ message: 'Recibo não encontrado.' });
    }

    // Combina o recibo antigo com as atualizações, garantindo que o ID e a data de criação não mudem
    receipts[receiptIndex] = { ...receipts[receiptIndex], ...updates };
    
    await writeReceipts(receipts);

    res.status(200).json(receipts[receiptIndex]);
  } catch (error) {
    console.error('Erro ao atualizar recibo:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar recibo.' });
  }
});

// -----------------------------------------------------------------------------
// MÉTODO DELETE: Deletar um recibo (Delete)
// -----------------------------------------------------------------------------
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const receiptId = parseInt(req.params.id, 10);
    
    const receipts = await readReceipts();
    const updatedReceipts = receipts.filter(r => r.id !== receiptId);

    // Verifica se algum item foi realmente removido
    if (receipts.length === updatedReceipts.length) {
      return res.status(404).json({ message: 'Recibo não encontrado.' });
    }

    await writeReceipts(updatedReceipts);
    
    // Retorna 204 (No Content), indicando sucesso na exclusão sem enviar dados de volta
    res.status(204).send(); 
  } catch (error) {
    console.error('Erro ao deletar recibo:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao deletar recibo.' });
  }
});

export default router;
// src/routes/emailRoutes.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { sendEmail } from '../services/emailService';

const router = Router();
// Protege todas as rotas de e-mail (só usuários logados podem enviar)
router.use(authMiddleware);

router.post('/send', async (req: Request, res: Response) => {
    const { toEmail, subject, htmlContent } = req.body;

    if (!toEmail || !subject || !htmlContent) {
        return res.status(400).json({ message: 'Campos obrigatórios: toEmail, subject, htmlContent' });
    }

    try {
        await sendEmail(toEmail, subject, htmlContent);
        res.status(200).json({ message: 'E-mail enviado com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar o e-mail.' });
    }
});

export default router;
// src/routes/authRoutes.ts (VERSÃO ATUALIZADA COM PRISMA)
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma'; // <-- Importa o Prisma Client
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Rota de Registro
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mustChangePassword: true, // Mantém a regra de negócio
      },
    });

    // Retorna o usuário sem a senha
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota de Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '8h' });

    res.status(200).json({ token, mustChangePassword: user.mustChangePassword ?? false });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota para Alterar Senha
router.post('/change-password', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user?.userId;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'Dados inválidos.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, mustChangePassword: false },
    });

    res.status(200).json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default router;
// src/routes/authRoutes.ts

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readUsers, writeUsers } from '../services/userService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const users = await readUsers();

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      mustChangePassword: true,
    };

    users.push(newUser);
    await writeUsers(users);

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validação básica de entrada
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // 2. Buscar o usuário no nosso "banco de dados"
    const users = await readUsers();
    const user = users.find(u => u.email === email);

    // 3. Se o usuário não for encontrado, retorne um erro genérico
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // Usamos 401 por segurança
    }

    // 4. Comparar a senha enviada com a senha criptografada salva
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 5. Se a senha for válida, gerar o JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('A chave secreta do JWT não foi definida no .env');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, // O que vai dentro do token (payload)
      jwtSecret,                              // A chave secreta
      { expiresIn: '8h' }                      // Duração do token
    );

    // 6. Enviar o token E O SINALIZADOR como resposta
    return res.status(200).json({
      token,
      mustChangePassword: user.mustChangePassword ?? false, // <-- MODIFIQUE A RESPOSTA
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

router.post('/change-password', authMiddleware, async (req: Request, res: Response) => {
  // Se chegou até aqui, o middleware já validou o token.

  const { newPassword } = req.body;
  const userId = req.user?.userId; // Pegamos o ID do usuário que veio do token

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'A nova senha é obrigatória e deve ter pelo menos 6 caracteres.' });
  }

  try {
    const users = await readUsers();

    // Encontra o índice do usuário na lista
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha do usuário e o sinalizador
    users[userIndex].password = hashedPassword;
    users[userIndex].mustChangePassword = false;

    // Salva a lista de usuários atualizada no arquivo
    await writeUsers(users);

    return res.status(200).json({ message: 'Senha alterada com sucesso.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default router;
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

interface JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Transforme a função em async
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Nenhum token fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Verifica se o usuário do token ainda existe no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      // Se o usuário não for encontrado, o token é de um usuário deletado (stale token).
      return res
        .status(401)
        .json({ message: "Token inválido. Usuário não encontrado." });
    }

    // Anexa os dados do usuário (payload do token) à requisição
    req.user = decoded;

    // Passa para a próxima função (a lógica da rota)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

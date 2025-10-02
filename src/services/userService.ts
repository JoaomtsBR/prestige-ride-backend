// src/services/userService.ts
import fs from 'fs/promises'; // Usamos a versão baseada em Promises do 'fs'
import path from 'path';

// Define a estrutura de um usuário
interface User {
  id: number;
  email: string;
  name?: string;
  password: string;
  createdAt: Date;
  mustChangePassword?: boolean;
}

const dbPath = path.join(__dirname, '..', '..', 'db.json');

// Função auxiliar para ler o banco de dados inteiro
const readDatabase = async (): Promise<{ users: User[]; receipts: any[] }> => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna a estrutura padrão
    return { users: [], receipts: [] };
  }
};

// Função para ler APENAS os usuários
export const readUsers = async (): Promise<User[]> => {
  const db = await readDatabase();
  return db.users || [];
};

// Função para escrever a lista de usuários no banco
export const writeUsers = async (users: User[]): Promise<void> => {
  const db = await readDatabase();
  db.users = users; // Atualiza apenas a parte dos usuários
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
};
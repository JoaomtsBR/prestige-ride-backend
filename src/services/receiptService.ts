// src/services/receiptService.ts
import fs from 'fs/promises';
import path from 'path';

interface ServiceLine {
  id: string;
  serviceDate: string;
  origin: string;
  destination: string;
  transfer: number;
  extras: number;
  total: number;
}

// ATUALIZE A INTERFACE PRINCIPAL DO RECIBO
export interface Receipt {
  id: number;
  date: string;
  number: string;
  clientName: string;
  companyName?: string; // Opcional
  address: string; // Representando o método de pagamento
  cpfCnpj: string;
  requester: string;
  passengers: string;
  services: ServiceLine[];
  observations?: string; // Opcional
  language: 'pt' | 'en' | 'es';
  grandTotal: number;
  createdAt: Date;
  createdBy: number;
}

const dbPath = path.join(__dirname, '..', '..', 'db.json');

// Função auxiliar (pode ser refatorada para um arquivo comum no futuro)
const readDatabase = async (): Promise<{ users: any[]; receipts: Receipt[] }> => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], receipts: [] };
  }
};

// Função para ler todos os recibos
export const readReceipts = async (): Promise<Receipt[]> => {
  const db = await readDatabase();
  return db.receipts || [];
};

// Função para escrever a lista de recibos
export const writeReceipts = async (receipts: Receipt[]): Promise<void> => {
  const db = await readDatabase();
  db.receipts = receipts;
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
};
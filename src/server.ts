// src/server.ts
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import receiptRoutes from './routes/receiptRoutes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/receipts', receiptRoutes);

// Rota principal de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Olá do seu back-end Prestige Ride!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
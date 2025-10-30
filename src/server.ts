// src/server.ts
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';

// Carrega o arquivo .env específico
const envConfig = dotenv.config({ path: envFile });

if (envConfig.error) {
  console.error(`Erro ao carregar o arquivo ${envFile}:`, envConfig.error.message);
  throw new Error(`Não foi possível carregar o arquivo de ambiente ${envFile}. Ele existe?`);
}

console.log(`--- ✅ Carregando ambiente de [${process.env.NODE_ENV}] do arquivo [${envFile}] ---`);

import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import receiptRoutes from "./routes/receiptRoutes";
import { driverRoutes } from "./routes/driverRoutes";
import { routeRoutes } from "./routes/routeRoutes";
import { serviceRoutes } from "./routes/serviceRoutes";
import emailRoutes from "./routes/emailRoutes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', driverRoutes);
app.use('/api', routeRoutes);
app.use('/api', serviceRoutes);

// Rota principal de teste
app.get("/", (req: Request, res: Response) => {
  res.send("Olá do seu back-end Prestige Ride!");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

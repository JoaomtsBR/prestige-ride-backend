// src/server.ts
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import receiptRoutes from "./routes/receiptRoutes";
import { driverRoutes } from "./routes/driverRoutes";
import { routeRoutes } from "./routes/routeRoutes";
import { serviceRoutes } from "./routes/serviceRoutes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/receipts', receiptRoutes);
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const receiptRoutes_1 = __importDefault(require("./routes/receiptRoutes"));
const driverRoutes_1 = require("./routes/driverRoutes");
const routeRoutes_1 = require("./routes/routeRoutes");
const serviceRoutes_1 = require("./routes/serviceRoutes");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use('/api/receipts', receiptRoutes_1.default);
app.use('/api', driverRoutes_1.driverRoutes);
app.use('/api', routeRoutes_1.routeRoutes);
app.use('/api', serviceRoutes_1.serviceRoutes);
// Rota principal de teste
app.get("/", (req, res) => {
    res.send("Olá do seu back-end Prestige Ride!");
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

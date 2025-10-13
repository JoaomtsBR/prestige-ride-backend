/*
  Warnings:

  - You are about to drop the column `despesa` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `despesas` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `estacionamento` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `estacionamentoReal` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `impostoPercentual` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `impostoValor` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `litrosAbastecidos` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `motorista` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `notaFiscal` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `pedagio` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `quilometragem` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `taxaCartao` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `valorCombustivel` on the `Receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "despesa",
DROP COLUMN "despesas",
DROP COLUMN "estacionamento",
DROP COLUMN "estacionamentoReal",
DROP COLUMN "impostoPercentual",
DROP COLUMN "impostoValor",
DROP COLUMN "litrosAbastecidos",
DROP COLUMN "motorista",
DROP COLUMN "notaFiscal",
DROP COLUMN "pedagio",
DROP COLUMN "quilometragem",
DROP COLUMN "services",
DROP COLUMN "taxaCartao",
DROP COLUMN "valorCombustivel",
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "tollCost" DOUBLE PRECISION,
    "mileage" DOUBLE PRECISION,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "transfer" DOUBLE PRECISION NOT NULL,
    "extras" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "routeId" INTEGER NOT NULL,
    "receiptId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "estacionamento" DOUBLE PRECISION,
    "estacionamentoReal" DOUBLE PRECISION,
    "taxaCartao" DOUBLE PRECISION,
    "despesa" DOUBLE PRECISION,
    "quilometragem" DOUBLE PRECISION,
    "pedagio" DOUBLE PRECISION,
    "litrosAbastecidos" DOUBLE PRECISION,
    "valorCombustivel" DOUBLE PRECISION,
    "impostoPercentual" DOUBLE PRECISION,
    "impostoValor" DOUBLE PRECISION,
    "notaFiscal" TEXT,
    "despesas" TEXT,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_origin_destination_key" ON "Route"("origin", "destination");

-- CreateIndex
CREATE UNIQUE INDEX "Expense_serviceId_key" ON "Expense"("serviceId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

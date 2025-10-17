/*
  Warnings:

  - You are about to alter the column `estacionamento` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `estacionamentoReal` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `taxaCartao` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `despesa` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `quilometragem` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,1)`.
  - You are about to alter the column `pedagio` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `litrosAbastecidos` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,3)`.
  - You are about to alter the column `valorCombustivel` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `impostoPercentual` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `impostoValor` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `cpfCnpj` on the `Receipt` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `language` on the `Receipt` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - You are about to alter the column `grandTotal` on the `Receipt` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `tollCost` on the `Route` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `mileage` on the `Route` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,1)`.
  - You are about to alter the column `transfer` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `extras` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `total` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - Added the required column `updatedAt` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Made the column `tollCost` on table `Route` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Made the column `mustChangePassword` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "estacionamento" SET DEFAULT 0,
ALTER COLUMN "estacionamento" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "estacionamentoReal" SET DEFAULT 0,
ALTER COLUMN "estacionamentoReal" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "taxaCartao" SET DEFAULT 0,
ALTER COLUMN "taxaCartao" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "despesa" SET DEFAULT 0,
ALTER COLUMN "despesa" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "quilometragem" SET DATA TYPE DECIMAL(10,1),
ALTER COLUMN "pedagio" SET DEFAULT 0,
ALTER COLUMN "pedagio" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "litrosAbastecidos" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "valorCombustivel" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "impostoPercentual" SET DEFAULT 0,
ALTER COLUMN "impostoPercentual" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "impostoValor" SET DEFAULT 0,
ALTER COLUMN "impostoValor" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Receipt" ALTER COLUMN "cpfCnpj" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "passengers" DROP NOT NULL,
ALTER COLUMN "language" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "grandTotal" SET DEFAULT 0,
ALTER COLUMN "grandTotal" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Route" ALTER COLUMN "tollCost" SET NOT NULL,
ALTER COLUMN "tollCost" SET DEFAULT 0,
ALTER COLUMN "tollCost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "mileage" SET DATA TYPE DECIMAL(10,1);

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "transfer" SET DEFAULT 0,
ALTER COLUMN "transfer" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "extras" SET DEFAULT 0,
ALTER COLUMN "extras" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mustChangePassword" SET NOT NULL;

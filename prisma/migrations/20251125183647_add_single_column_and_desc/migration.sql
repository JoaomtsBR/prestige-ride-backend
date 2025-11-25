-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "useSingleColumn" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "serviceDescription" TEXT;

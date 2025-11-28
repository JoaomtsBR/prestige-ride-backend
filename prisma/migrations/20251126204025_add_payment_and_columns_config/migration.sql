-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "paymentMethod" VARCHAR(50),
ADD COLUMN     "visibleColumns" JSONB DEFAULT '{"transfer": true, "extras": true, "total": true}';

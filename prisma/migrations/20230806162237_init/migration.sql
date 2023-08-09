-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "refresh_token_expires_in" INTEGER;

-- AlterTable
ALTER TABLE "Goals" ADD COLUMN     "due_date" TIMESTAMP(3);

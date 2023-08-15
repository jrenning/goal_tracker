-- AlterTable
ALTER TABLE "Goals" ADD COLUMN     "exp_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "gold_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "last_points_added" DROP NOT NULL,
ALTER COLUMN "last_points_added" DROP DEFAULT;

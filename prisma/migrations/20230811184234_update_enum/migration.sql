-- CreateEnum
CREATE TYPE "EventTypes" AS ENUM ('ADD_POINTS', 'GAIN_LEVEL', 'COMPLETE_GOAL', 'DELETE_GOAL', 'GAIN_REWARD', 'CREATE_GOAL_BASIC', 'CREATE_GOAL_DUE_DATE', 'CREATE_GOAL_REPEATING', 'COMPLETE_CHECKLIST_ITEM', 'BUY_SHOP_ITEM', 'CREATE_SHOP_ITEM_BASIC', 'CREATE_SHOP_ITEM_REPEATING');

-- CreateEnum
CREATE TYPE "TimeFrame" AS ENUM ('Day', 'Week', 'Month', 'Year', 'None');

-- AlterTable
ALTER TABLE "RepeatData" ADD COLUMN     "repeat_frequency" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "ShopRepeatData" (
    "item_id" INTEGER NOT NULL,
    "type" "RepeatTypes" NOT NULL,
    "days" "DayOfWeek"[],
    "repeat_frequency" INTEGER NOT NULL DEFAULT 1,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_repeated" TIMESTAMP(3),
    "stop_date" TIMESTAMP(3),

    CONSTRAINT "ShopRepeatData_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_at" TIMESTAMP(3),
    "bought" BOOLEAN NOT NULL,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "user_id" TEXT NOT NULL,
    "coins" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Events" (
    "user_id" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "event" "EventTypes" NOT NULL,
    "value" INTEGER NOT NULL,
    "goal_category" "Category" NOT NULL,
    "reward_category" "RewardCategories",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "name" TEXT NOT NULL,
    "event" "EventTypes" NOT NULL,
    "value" INTEGER NOT NULL,
    "time_frame" "TimeFrame" NOT NULL DEFAULT 'None',
    "goal_category" "Category" NOT NULL,
    "reward_category" "RewardCategories",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "user_id" TEXT NOT NULL,
    "achievement_name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("user_id","achievement_name")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopRepeatData_item_id_key" ON "ShopRepeatData"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "Achievement"("name");

-- AddForeignKey
ALTER TABLE "ShopRepeatData" ADD CONSTRAINT "ShopRepeatData_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "ShopItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopItem" ADD CONSTRAINT "ShopItem_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Inventory"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievement_name_fkey" FOREIGN KEY ("achievement_name") REFERENCES "Achievement"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

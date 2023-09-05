import { Session } from "next-auth";
import { prisma } from "~/server/db";
import { api } from "./api";
import { appRouter } from "~/server/api/root";
import {
  GoalsWithRepeat,
  ShopItemsWithRepeat,
} from "~/server/api/routers/goals";

export const updateRepeatingGoals = async (session: Session) => {
  const today = new Date();
  const caller = await appRouter.createCaller({
    prisma: prisma,
    session: session,
  });
  const goalsToRepeat: GoalsWithRepeat =
    await caller.goals.getRepeatingGoalsByDate({
      date: new Date(),
    });

  // filter out ones that are already repeated
  const filteredGoals =
    goalsToRepeat &&
    goalsToRepeat.filter(
      (goal) =>
        goal.repeat?.last_repeated?.toDateString() != today.toDateString()
    );

  // add new goal if needed, DON'T ADD REPEATING DATA (avoids never ending tasks)
  let added_count = 0;
  if (filteredGoals && session.user) {
    filteredGoals.map(async (goal) => {
      added_count += 1;
      await prisma.$transaction([
        prisma.goals.create({
          data: {
            //@ts-ignore
            user_id: session.user.id,
            parent_id: goal.id,
            name: goal.name,
            points: goal.points,
            difficulty: goal.difficulty,
            completed: false,
            category: goal.category,
          },
        }),
        // update repeat date
        prisma.repeatData.update({
          where: {
            goal_id: goal.id,
          },
          data: {
            last_repeated: today,
          },
        }),
      ]);
    });
  }
  return added_count;
};

export const updateRepeatingShopItems = async (session: Session) => {
  const today = new Date();
  const caller = await appRouter.createCaller({
    prisma: prisma,
    session: session,
  });
  const itemsToRepeat: ShopItemsWithRepeat =
    await caller.shop.getRepeatingItemsByDate({
      date: new Date(),
    });

  // filter out ones that are already repeated
  const filteredItems =
    itemsToRepeat &&
    itemsToRepeat.filter(
      (item) =>
        item.repeat?.last_repeated?.toDateString() != today.toDateString()
    );

  // add new item if needed, DON'T ADD REPEATING DATA (avoids never ending tasks)
  let added_count = 0;
  if (filteredItems && session.user) {
    filteredItems.map(async (item) => {
      added_count += 1;
      await prisma.$transaction(async (tx) => {
        if (session.user) {
          await tx.shopItem.create({
            data: {
              user_id: session.user.id,
              parent_id: item.id,
              name: item.name,
              rarity: item.rarity,
              reward_category: item.reward_category,
              cost: item.cost,
              bought: false,
            },
          });
          // update repeat date
          await tx.shopRepeatData.update({
            where: {
              item_id: item.id,
            },
            data: {
              last_repeated: today,
            },
          });
        }
      });
    });
  }
  return added_count;
};


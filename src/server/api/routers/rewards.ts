import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { goal_categories } from "./goals";

export const reward_categories = z.enum(["Outdoors", "Gift", "Leisure", "Experience", "Food"])


export const rewardsRouter = createTRPCRouter({
  getLevelRewards: publicProcedure
    .input(z.object({ level: z.number(), category: goal_categories }))
    .query(({ ctx, input }) => {
      return ctx.prisma.rewards.findUnique({
        where: {
          user_id_level_category: {
            user_id: 1,
            level: input.level,
            category: input.category,
          },
        },
      });
    }),
    createReward: publicProcedure
    .input(z.object({name: z.string(), reward_category: reward_categories, goal_category: goal_categories, level: z.number()}))
    .mutation(({ctx, input})=> {
        return ctx.prisma.rewards.upsert({
            where: {
                user_id_level_category: {
                    user_id: 1,
                    level: input.level,
                    category: input.goal_category
                }
            },
            update: {
                reward_category: {
                    push: input.reward_category
                },
                rewards: {
                    push: input.name
                }
            },
            create: {
                level: input.level,
                category: input.goal_category,
                rewards: [input.name],
                reward_category: [input.reward_category]
            }
        })
    })
});

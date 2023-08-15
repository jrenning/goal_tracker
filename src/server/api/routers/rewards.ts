import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { goal_categories } from "./goals";

export const reward_categories = z.enum(["Outdoors", "Gift", "Leisure", "Experience", "Food"])


export const rewardsRouter = createTRPCRouter({
  getLevelRewards: protectedProcedure
    .input(z.object({ level: z.number(), category: goal_categories,  }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rewards.findUnique({
        where: {
          user_id_level_category: {
            user_id: ctx.session.user.id,
            level: input.level,
            category: input.category,
          },
        },
      });
    }),
    getFinishedRewards: protectedProcedure
    .input(z.object({date: z.date(), }))
    .query(({ctx, input})=> {
        return ctx.prisma.rewards.findMany({
            where: {
                achieved_at: {
                    gte: input.date
                },
                user_id: ctx.session.user.id
            }
        })

    }),
    createReward: protectedProcedure
    .input(z.object({name: z.string(), reward_category: reward_categories, goal_category: goal_categories, level: z.number(), }))
    .mutation(({ctx, input})=> {
        return ctx.prisma.rewards.upsert({
            where: {
                user_id_level_category: {
                    user_id: ctx.session.user.id,
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
                user_id: ctx.session.user.id,
                level: input.level,
                category: input.goal_category,
                rewards: [input.name],
                reward_category: [input.reward_category]
            }
        })
    })
});

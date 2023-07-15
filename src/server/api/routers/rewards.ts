import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { categories } from "./goals";


export const rewardsRouter = createTRPCRouter({
  getLevelRewards: publicProcedure
  .input(z.object({level: z.number(), category: categories}))
  .query(({ ctx, input }) => {

    return ctx.prisma.rewards.findUnique({
        where: {
            level_category: {
                level: input.level,
                category: input.category
            }
        }
    })
  }),
})


import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getCurrentUserInfo: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findFirst()
    }),
    addPoints: publicProcedure
    .input(z.object({ points: z.number() }))
    .mutation(async ({ctx, input}) => {
        const today = new Date()
        const points_added = ctx.prisma.user.updateMany({
            data: {
                current_points: {
                    increment: input.points
                },
                total_points: {
                    increment: input.points
                },
                last_points_added: today.toISOString()
                
            }
        })
        return points_added
    }),
    gainLevel: publicProcedure
    .input(z.object({overflow: z.number()}))
    .mutation(async ({ctx, input}) => {
        const new_level = ctx.prisma.user.updateMany({
            data: {
                level: {
                    increment: 1
                },
                current_points: input.overflow
            }
        })
        return new_level
    }),
    saveSubscription: publicProcedure
    .input(z.object({json: z.any()}))
    .mutation(async ({ctx, input}) => {
        const new_subscription = ctx.prisma.user.updateMany({
            data: {
                subscription: input.json
            }
        })
        return new_subscription
    })

});

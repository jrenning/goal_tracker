import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { goal_categories } from "./goals";

export const userRouter = createTRPCRouter({
  getCurrentUserInfo: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst();
  }),
  getUserStats: publicProcedure.query(({ctx})=> {
    return ctx.prisma.user.findUnique({
        where: {
            id: 1
        },
        select: {
            stats: true
        }
    })
  }),
  getCategoryLevel: publicProcedure
    .input(z.object({ category: goal_categories }))
    .query(({ ctx, input }) => {
      return ctx.prisma.stats.findUnique({
        where: {
          user_id_category: {
            user_id: 1,
            category: input.category,
          },
        },
        select: {
          level: true,
        },
      });
    }),
  getCategoryCurrentPoints: publicProcedure
    .input(z.object({ category: goal_categories }))
    .query(({ ctx, input }) => {
      return ctx.prisma.stats.findUnique({
        where: {
          user_id_category: {
            user_id: 1,
            category: input.category,
          },
        },
        select: {
          current_points: true,
        },
      });
    }),
  addPoints: publicProcedure
    .input(z.object({ points: z.number(), category: goal_categories }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date();
      // FIX: WHEN ADDING MULTIPLE USERS CHANGE ID
      const points_added = await ctx.prisma.stats.update({
        where: {
          user_id_category: {
            user_id: 1,
            category: input.category,
          },
        },
        data: {
          current_points: {
            increment: input.points,
          },
          total_points: {
            increment: input.points,
          },
        },
      });

      await ctx.prisma.user.update({
        where: {
          id: 1,
        },
        data: {
          last_points_added: today.toISOString(),
        },
      });

      return points_added;
    }),
  gainLevel: publicProcedure
    .input(z.object({ overflow: z.number(), category: goal_categories }))
    .mutation(async ({ ctx, input }) => {
      const new_level = ctx.prisma.stats.update({
        where: {
          user_id_category: {
            user_id: 1,
            category: input.category,
          },
        },
        data: {
          level: {
            increment: 1,
          },
        },
      });
      return new_level;
    }),
  saveSubscription: publicProcedure
    .input(z.object({ json: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const new_subscription = ctx.prisma.user.updateMany({
        data: {
          subscription: input.json,
        },
      });
      return new_subscription;
    }),
});

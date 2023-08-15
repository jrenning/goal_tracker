import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { goal_categories } from "./goals";

export const historyRouter = createTRPCRouter({
  getPointDataByCategoryDate: protectedProcedure
    .input(z.object({ category: goal_categories, date: z.date() }))
    .query(async ({ ctx, input }) => {
      const point_data = await ctx.prisma.pointsData.findMany({
        where: {
          category: input.category,
          date: {
            gte: input.date,
          },
          user_id: ctx.session.user.id,
        },
        select: {
          points: true,
          date: true,
        },
      });
      return point_data;
    }),
  getAllPointDataByCategory: protectedProcedure
    .input(z.object({ category: goal_categories }))
    .query(({ ctx, input }) => {
      return ctx.prisma.pointsData.findMany({
        where: {
          category: input.category,
          user_id: ctx.session.user.id,
        },
      });
    }),
  getLevelDataByCategoryDate: protectedProcedure
    .input(z.object({ category: goal_categories, date: z.date() }))
    .query(async ({ ctx, input }) => {
      const level_data = await ctx.prisma.levelData.findMany({
        where: {
          category: input.category,
          date: {
            gte: input.date,
          },
          user_id: ctx.session.user.id,
        },
        select: {
          level: true,
          date: true,
        },
      });
      return level_data;
    }),
  getAllLevelDataByCategory: protectedProcedure
    .input(z.object({ category: goal_categories }))
    .query(({ ctx, input }) => {
      return ctx.prisma.levelData.findMany({
        where: {
          category: input.category,
          user_id: ctx.session.user.id,
        },
      });
    }),
});
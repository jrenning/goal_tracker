import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { goal_categories } from "./goals";

export const testRouter = createTRPCRouter({
  createTestUser: protectedProcedure.mutation(async ({ ctx }) => {
    const c = goal_categories.Values;
    const categories = [
      { category: c.Education },
      { category: c.Social },
      { category: c.Hobby },
      { category: c.Physical },
      { category: c.Career },
    ];
    return await ctx.prisma.user.create({
      data: {
        id: "test",
        inventory: {
          create: {
            coins: 0,
          },
        },
        stats: {
          createMany: {
            data: categories,
          },
        },
    }});
  }),
  cleanUp: protectedProcedure.mutation(async ({ ctx }) => {
    const data = await ctx.prisma.user.deleteMany();
    await ctx.prisma.$disconnect();
    return data;
  }),
});

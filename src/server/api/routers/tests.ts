import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { goal_categories } from "./goals";

export const testRouter = createTRPCRouter({
  createTestUser: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.create({
      data: {
        id: "test",
      },
    });
  }),
  cleanUp: protectedProcedure
  .mutation(async ({ctx})=> {
    const data = await ctx.prisma.user.deleteMany()
    await ctx.prisma.$disconnect()
    return data
  })
});
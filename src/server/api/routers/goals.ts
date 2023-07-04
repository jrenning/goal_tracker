import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const goalsRouter = createTRPCRouter({
  getCurrentGoals: publicProcedure.query(({ ctx }) => {
    let today = new Date();
    return ctx.prisma.goals.findMany({
      where: {
        created_at: {
          lte: today.toJSON(),
        },
        completed: false,
      },
    });
  }),
  getCompletedGoals: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(({ input, ctx}) => {
      return ctx.prisma.goals.findMany({
        where: {
            date_completed: {
                gte: input.date
            }
        }
      })
    }),
    completeGoal: publicProcedure
    .input(z.object({id: z.number()}))
    .mutation(async ({input, ctx}) => {
        // just yyyy/mm/dd
        const today = new Date().toISOString()
        const goal = await ctx.prisma.goals.update({
            where: {
                id: input.id
            },
            data: {
                completed: true,
                date_completed: today
            }
        })
        return goal
    }),
    addGoal: publicProcedure
    .input(z.object({name: z.string(), exp: z.number(), difficulty: z.number()}))
    .mutation(async ({input, ctx})=> {
        const goal = await ctx.prisma.goals.create({
            data: {
                name: input.name,
                points: input.exp,
                difficulty: input.difficulty,
                completed: false
            }
        })
        return goal
    })
});
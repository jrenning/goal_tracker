import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const goal_categories = z.enum([
  "Physical",
  "Education",
  "Social",
  "Hobby",
  "Odd_Job",
]);

export const repeat_type = z.enum(["Daily", "Weekly", "Monthly", "Yearly"]);

export const days_of_week = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const goalsRouter = createTRPCRouter({
  getGoalById: publicProcedure
  .input(z.object({id: z.number()}))
  .query(({ctx, input})=> {
    return ctx.prisma.goals.findUnique({
      where: {
        id: input.id
      }
    })
  }),
  getRepeatingGoals: publicProcedure.query(({ctx})=> {
    const today = new Date();
    return ctx.prisma.repeatData.findMany({
      where: {
        stop_date: {
          lt: today.toISOString()
        },
        start_date: {
          gte: today.toISOString()
        }
    },
    include: {
      goal: true
    }
    })
  }),
  setLastRepeat: publicProcedure
  .input(z.object({id: z.number()}))
  .mutation(({ctx, input})=> {
    const today = new Date();
    return ctx.prisma.repeatData.update({
      where: {
        goal_id: input.id
      },
      data: {
        last_repeated: today.toISOString()
      }
    })

  }),
  getCurrentGoals: publicProcedure.query(({ ctx }) => {
    const today = new Date();
    return ctx.prisma.goals.findMany({
      where: {
        created_at: {
          lte: today.toJSON(),
        },
        completed: false,
        repeat: {
          start_date: {
            gte: today.toJSON()
          }
        }
      },
    });
  }),
  getGoalsByCategory: publicProcedure
    .input(z.object({ category: goal_categories }))
    .query(({ input, ctx }) => {
      return ctx.prisma.goals.findMany({
        where: {
          category: input.category,
        },
      });
    }),
  getCompletedGoals: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.goals.findMany({
        where: {
          date_completed: {
            gte: input.date,
          },
        },
      });
    }),
  completeGoal: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // just yyyy/mm/dd
      const today = new Date().toISOString();
      const goal = await ctx.prisma.goals.update({
        where: {
          id: input.id,
        },
        data: {
          completed: true,
          date_completed: today,
        },
      });
      return goal;
    }),
  addGoal: publicProcedure
    .input(
      z.object({
        name: z.string(),
        exp: z.number(),
        difficulty: z.number(),
        category: goal_categories,
        repeat_type: repeat_type.optional(),
        days_of_week: z.array(days_of_week).optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let goal;
      if (input.repeat_type && input.start_date && input.end_date) {
        goal = await ctx.prisma.goals.create({
          data: {
            name: input.name,
            points: input.exp,
            difficulty: input.difficulty,
            completed: false,
            category: input.category,
            repeat: {
              create: {
                days: input.days_of_week,
                type: input.repeat_type,
                start_date: input.start_date,
                stop_date: input.end_date,
              },
            },
          },
        });
      } else {
        goal = await ctx.prisma.goals.create({
          data: {
            name: input.name,
            points: input.exp,
            difficulty: input.difficulty,
            completed: false,
            category: input.category,
          },
        });
      }

      return goal;
    }),
});

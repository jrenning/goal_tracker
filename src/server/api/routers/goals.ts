import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Session } from "next-auth";
import { Goals, Prisma, PrismaClient, RepeatData } from "@prisma/client";
import {
  MonthlyInRange,
  YearlyInRange,
  getDaysBetweenDates,
  getDaysInRange,
  getMonthsBetweenDates,
  getWeeksBetweenDates,
  isRepeatInRange,
} from "~/utils/datetime";

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

// this is a separate function to get an accurate type for the input below
async function getGoalsInRange(
  prisma: PrismaClient,
  session: Session,
  start: Date,
  end: Date
) {
  const goals_in_range = await prisma.goals.findMany({
    where: {
      //@ts-ignore
      user_id: session.user.id,
      completed: false,
      repeat: {
        start_date: {
          lte: end,
        },
      },
      OR: [
        {
          repeat: {
            stop_date: {
              gte: start,
            },
          },
        },
        {
          repeat: {
            stop_date: null,
          },
        },
      ],
    },
    include: {
      repeat: true,
    },
  });

  return goals_in_range;
}

export async function getRepeatingGoalsInRange(
  prisma: PrismaClient,
  session: Session,
  start: Date,
  end: Date
) {
  const goals_in_range = await getGoalsInRange(prisma, session, start, end);

  const filtered_goals = filterGoalsInRange(goals_in_range, start, end);

  return filtered_goals;
}

export type GoalsWithRepeat = Prisma.PromiseReturnType<typeof getGoalsInRange>;

export function filterGoalsInRange(
  goals: GoalsWithRepeat,
  start: Date,
  end: Date
) {
  const day_map = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  let range_start;
  let range_end;
  const filtered_goals: GoalsWithRepeat = [];
  goals.forEach((goal) => {
    // know that in this range the goal COULD repeat, ie goal doesn't stop in range
    if (goal.repeat) {
      range_start =
        start < goal.repeat.start_date ? goal.repeat.start_date : start;
      if (goal.repeat.stop_date) {
        range_end = end < goal.repeat.stop_date ? end : goal.repeat.stop_date;
      } else {
        range_end = end;
      }

      let distance;
      let end_distance;
      let type = goal.repeat.type;
      if (type == "Daily") {
        distance = getDaysBetweenDates(goal.repeat.start_date, start);
        end_distance = getDaysBetweenDates(goal.repeat.start_date, end);
        if (goal.repeat.start_date.getTime() == start.getTime()) {
          filtered_goals.push(goal);
        } else if (
          isRepeatInRange(distance, end_distance, goal.repeat.repeat_frequency)
        ) {
          filtered_goals.push(goal);
        }
      } else if (type == "Weekly") {
        distance = getWeeksBetweenDates(goal.repeat.start_date, start);
        end_distance = getWeeksBetweenDates(goal.repeat.start_date, end);

        let days_included: number[] = [];

        // only include days of week in the weeks that are valid for the repeat type
        // if start week is valid but end is not set new end date to end of start week to get days included
        if (
          distance % goal.repeat.repeat_frequency == 0 &&
          !(end_distance % goal.repeat.repeat_frequency == 0)
        ) {
          const temp_start = new Date(
            range_start.getFullYear(),
            range_start.getMonth(),
            range_start.getDate()
          );
          range_end = new Date(
            temp_start.setDate(temp_start.getDate() + (6 - temp_start.getDay()))
          );
          days_included = getDaysInRange(range_start, range_end);
        }
        else if (
          end_distance % goal.repeat.repeat_frequency == 0 &&
          !(distance % goal.repeat.repeat_frequency == 0)
        ) {
          const temp_end = new Date(
            range_end.getFullYear(),
            range_end.getMonth(),
            range_end.getDate()
          );
          range_start = new Date(
            temp_end.setDate(temp_end.getDate() - temp_end.getDay())
          );
          days_included = getDaysInRange(range_start, range_end);
        } else if (
          end_distance % goal.repeat.repeat_frequency == 0 &&
          distance % goal.repeat.repeat_frequency == 0
        ) {
          days_included = getDaysInRange(range_start, range_end);
        } else {
          // if there is a valid week in between it will have all of the days
          if ((end_distance - distance) % goal.repeat.repeat_frequency == 0 && (end_distance-distance) !== 0) {
            days_included = [0, 1, 2, 3, 4, 5, 6];
          }
        }


        const days_in_goal = goal.repeat.days.map((day) => day_map[day]);

        // if they share days in common you're good
        if (days_included.some((r) => days_in_goal.indexOf(r) >= 0)) {
          filtered_goals.push(goal);
        }
      } else if (type == "Monthly") {
        distance = getMonthsBetweenDates(goal.repeat.start_date, start);
        end_distance = getMonthsBetweenDates(goal.repeat.start_date, end);
        if (goal.repeat.start_date.getTime() == start.getTime()) {
          filtered_goals.push(goal);
        } else if (
          MonthlyInRange(range_start, distance, range_end, end_distance, goal.repeat.repeat_frequency, goal.repeat.start_date)
        ) {
            filtered_goals.push(goal);

        }
      } else {
        distance = start.getFullYear() - goal.repeat.start_date.getFullYear();
        end_distance = end.getFullYear() - goal.repeat.start_date.getFullYear();
        if (goal.repeat.start_date.getTime() == start.getTime()) {
          filtered_goals.push(goal);
        } else if (
          YearlyInRange(
            range_start,
            distance,
            range_end,
            end_distance,
            goal.repeat.repeat_frequency,
            goal.repeat.start_date
          )
        ) {
          filtered_goals.push(goal);
        }
      }
    }
  });
  return filtered_goals;
}

export const goalsRouter = createTRPCRouter({
  clear: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.goals.deleteMany({
      where: {
        user_id: ctx.session.user.id,
      },
    });
  }),
  getGoalById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.goals.findUnique({
        where: {
          id: input.id,
        },
        include: {
          repeat: true,
          checklist: true,
        },
      });
    }),
  getRepeatingGoalsByDate: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const goals = await getRepeatingGoalsInRange(ctx.prisma, ctx.session, input.date, input.date)

      return goals;
    }),
  getRepeatingGoalsInMonth: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const start_of_month = new Date(input.date.getFullYear(), input.date.getMonth(), 1)
      const goals = await getRepeatingGoalsInRange(ctx.prisma, ctx.session, start_of_month, input.date)

      return goals
    }),
  getDueDatesInMonth: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(({ ctx, input }) => {
      const previous_month = new Date(
        input.date.getFullYear(),
        input.date.getMonth() - 1,
        input.date.getDate()
      );
      return ctx.prisma.goals.findMany({
        where: {
          user_id: ctx.session.user.id,
          completed: false,
          due_date: {
            lte: input.date,
            gte: previous_month,
          },
        },
      });
    }),
  getDueDatesToday: protectedProcedure.query(({ ctx }) => {
    const today = new Date();
    today.setUTCHours(0,0,0,0)
    return ctx.prisma.goals.findMany({
      where: {
        user_id: ctx.session.user.id,
        completed: false,
        due_date: today,
      },
    });
  }),

  setLastRepeat: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return ctx.prisma.repeatData.update({
        where: {
          goal_id: input.id,
        },
        data: {
          last_repeated: today,
        },
      });
    }),
  getCurrentGoals: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const goals = await ctx.prisma.goals.findMany({
      where: {
        completed: false,
        user_id: ctx.session.user.id,
        OR: [
          {
            repeat: {
              start_date: {
                lte: today,
              },
            },
          },
          {
            repeat: {
              is: null,
            },
          },
        ],
      },
      include: {
        repeat: true,
        checklist: true,
      },
      orderBy: {
        due_date: "asc",
      },
    });
    return goals;
  }),
  getGoalsByCategory: protectedProcedure
    .input(z.object({ category: goal_categories }))
    .query(({ input, ctx }) => {
      return ctx.prisma.goals.findMany({
        where: {
          category: input.category,
          user_id: ctx.session.user.id,
        },
      });
    }),
  getCompletedGoals: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.goals.findMany({
        where: {
          date_completed: {
            gte: input.date,
          },
          user_id: ctx.session.user.id,
        },
      });
    }),
  completeGoal: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // just yyyy/mm/dd
      const today = new Date();
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
  completeGoalChecklistItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date();
      const completed_item = await ctx.prisma.checkListItem.update({
        where: {
          id: input.id,
        },
        data: {
          completed: true,
          date_completed: today,
        },
      });
      return completed_item;
    }),
  addGoal: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        exp: z.number(),
        difficulty: z.number(),
        category: goal_categories,
        due_date: z.date().optional(),
        repeat_type: repeat_type.optional(),
        days_of_week: z.array(days_of_week).optional(),
        repeat_freq: z.number().optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
        checklist_items: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        const goal = await tx.goals.create({
          data: {
            user_id: ctx.session.user.id,
            name: input.name,
            points: input.exp,
            difficulty: input.difficulty,
            due_date: input.due_date ? input.due_date : undefined,
            completed: false,
            category: input.category,
          },
        });
        if (input.due_date && input.repeat_type) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Can't specify a due date on a repeating goal, set the end date instead",
          });
        }

        if (input.repeat_type && input.start_date) {
          if (input.end_date) {
            if (input.start_date > input.end_date) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Can't have a start date later than the end date",
              });
            }
          }
          await tx.repeatData.create({
            data: {
              type: input.repeat_type,
              start_date: input.start_date,
              goal_id: goal.id,
              days: input.days_of_week,
              stop_date: input.end_date,
              repeat_frequency: input.repeat_freq,
            },
          });
        }

        if (input.checklist_items) {
          const checklist_items = input.checklist_items.map((item) => {
            return {
              name: item,
              goal_id: goal.id,
              completed: false,
            };
          });
          await tx.checkListItem.createMany({
            data: checklist_items,
          });
        }

        const full_goal = await tx.goals.findUnique({
          where: {
            id: goal.id
          },
          include: {
            checklist: true,
            repeat: true
          }
        })

        return full_goal
      });
    }),
  deleteGoal: protectedProcedure
    .input(z.object({ goal_id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.goals.delete({
        where: {
          id: input.goal_id,
        },
      });
    }),
});

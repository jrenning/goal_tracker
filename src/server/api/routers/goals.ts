import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Session } from "next-auth";
import { Goals, Prisma, PrismaClient, RepeatData } from "@prisma/client";
import {
  calculateCoins,
  calculateExp,
  filterItemsInRange,
  generateMultiplier,
} from "~/utils/goals";
import { getShopItemsInRange } from "./shop";
import { Input } from "postcss";
import { isTypedArray } from "util/types";
import { getTodayAtMidnight } from "~/utils/datetime";

export const goal_categories = z.enum([
  "Physical",
  "Education",
  "Social",
  "Hobby",
  "Career",
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

const multiplier_types = z.enum(["Exp", "Coins"]);

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

  const filtered_goals = filterItemsInRange(goals_in_range, start, end);
  return filtered_goals;
}

export type ShopItemsWithRepeat = Prisma.PromiseReturnType<
  typeof getShopItemsInRange
>;
export type GoalsWithRepeat = Prisma.PromiseReturnType<typeof getGoalsInRange>;

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
    .query(async ({ ctx, input }) => {
      const initial_goal = await ctx.prisma.goals.findUnique({
        where: {
          id: input.id,
        },
        include: {
          repeat: true,
          checklist: true,
        },
      });

      // if initial goal has a parent id (ie it is a child of a repeating goal)
      // then just return the parent
      if (initial_goal?.parent_id) {
        return await ctx.prisma.goals.findUnique({
          where: {
            id: initial_goal.parent_id,
          },
          include: {
            repeat: true,
            checklist: true,
          },
        });
      } else {
        return initial_goal;
      }
    }),
  getRepeatingGoalsByDate: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const goals = await getRepeatingGoalsInRange(
        ctx.prisma,
        ctx.session,
        input.date,
        input.date
      );

      return goals;
    }),
  getRepeatingGoalsInMonth: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const start_of_month = new Date(
        input.date.getFullYear(),
        input.date.getMonth(),
        1
      );
      const goals = await getRepeatingGoalsInRange(
        ctx.prisma,
        ctx.session,
        start_of_month,
        input.date
      );

      return goals;
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
    today.setUTCHours(0, 0, 0, 0);
    return ctx.prisma.goals.findMany({
      where: {
        user_id: ctx.session.user.id,
        completed: false,
        due_date: today,
      },
    });
  }),

  getFutureGoalsByDate: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const repeating_goals = await getRepeatingGoalsInRange(
        ctx.prisma,
        ctx.session,
        input.date,
        input.date
      );
      const due_date_goals = await ctx.prisma.goals.findMany({
        where: {
          user_id: ctx.session.user.id,
          completed: false,
          due_date: input.date,
        },
      });

      return due_date_goals.concat(repeating_goals);
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
  getCurrentGoalsByCategory: protectedProcedure
    .input(z.object({ category: z.array(goal_categories) }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const goals = await ctx.prisma.goals.findMany({
        where: {
          completed: false,
          category: {
            in: input.category,
          },
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

  getAllGoals: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.goals.findMany({
      where: {
        user_id: ctx.session.user.id,
      },
    });
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
    .input(z.object({ date: z.date().optional() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.goals.findMany({
        where: {
          date_completed: {
            gte: input.date ? input.date : getTodayAtMidnight(),
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
      return ctx.prisma.$transaction(async (tx) => {
        // complete the goal
        const goal = await tx.goals.update({
          where: {
            id: input.id,
          },
          data: {
            completed: true,
            date_completed: today,
          },
        });

        const gold_added = Math.floor(
          calculateCoins(goal.points) * goal.gold_multiplier
        );
        // add gold
        await tx.inventory.update({
          where: {
            user_id: ctx.session.user.id,
          },
          data: {
            coins: {
              increment: gold_added,
            },
          },
        });
        const points_added = Math.floor(goal.points * goal.exp_multiplier);
        // add points
        const updated_points = await tx.stats.update({
          where: {
            user_id_category: {
              user_id: ctx.session.user.id,
              category: goal.category,
            },
          },
          data: {
            current_points: {
              increment: points_added,
            },
            total_points: {
              increment: points_added,
            },
          },
        });

        await tx.pointsData.create({
          data: {
            user_id: ctx.session.user.id,
            points: updated_points.total_points,
            date: today,
            category: goal.category,
          },
        });

        return {
          goal: goal,
          points_added: points_added,
          gold_added: gold_added,
        };
      });
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
        difficulty: z.number(),
        category: goal_categories,
        due_date: z.date().optional(),
        repeat_type: repeat_type.optional(),
        days_of_week: z.array(days_of_week).optional(),
        repeat_freq: z.number().optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
        checklist_items: z.array(z.string()).optional(),
        parent_id: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        const repeating = input.repeat_type ? true : false;
        const goal = await tx.goals.create({
          data: {
            user_id: ctx.session.user.id,
            parent_id: input.parent_id ? input.parent_id : undefined,
            name: input.name,
            points: calculateExp(
              input.difficulty,
              input.checklist_items?.length,
              input.due_date,
              repeating
            ),
            difficulty: input.difficulty,
            due_date: input.due_date ? input.due_date : undefined,
            completed: input.repeat_type ? true : false,
            category: input.category,
            exp_multiplier: generateMultiplier(),
            gold_multiplier: generateMultiplier(),
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
            id: goal.id,
          },
          include: {
            checklist: true,
            repeat: true,
          },
        });

        return full_goal;
      });
    }),
  updateMultiplier: protectedProcedure
    .input(
      z.object({
        new_multiplier: z.number(),
        categories: goal_categories.array(),
        type: multiplier_types,
      })
    )
    .mutation(({ ctx, input }) => {
      if (input.type == "Exp") {
        return ctx.prisma.goals.updateMany({
          where: {
            user_id: ctx.session.user.id,
            category: {
              in: input.categories,
            },
          },
          data: {
            exp_multiplier: input.new_multiplier,
          },
        });
      } else {
        return ctx.prisma.goals.updateMany({
          where: {
            user_id: ctx.session.user.id,
            category: {
              in: input.categories,
            },
          },
          data: {
            gold_multiplier: input.new_multiplier,
          },
        });
      }
    }),
  updateGoal: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
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
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        const goal = await ctx.prisma.goals.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            difficulty: input.difficulty,
            category: input.category,
            due_date: input.due_date,
            points: calculateExp(
              input.difficulty,
              input.checklist_items?.length,
              input.due_date,
              !!input.repeat_type
            ),
          },
        });

        // update repeat data 
        if (input.repeat_type) {
          await ctx.prisma.repeatData
            .upsert({
              where: {
                goal_id: input.id,
              },
              update: {
                  type: input.repeat_type,
                  repeat_frequency: input.repeat_freq,
                  days: input.days_of_week,
                  start_date: input.start_date,
                  stop_date: input.end_date,
              },
              create: {
                goal_id: input.id,
                type: input.repeat_type,
                repeat_frequency: input.repeat_freq,
                days: input.days_of_week,
                start_date: input.start_date,
                stop_date: input.end_date,
              }
            })
            .catch((err) => {
              throw new TRPCError(err);
            });
        }

        // update checklist data 
        // TODO: make this smarter so things like completed are not lost
        if (input.checklist_items) {
          // delete old 
          await ctx.prisma.checkListItem.deleteMany({
            where: {
              goal_id: input.id
            }
          })

          const new_items = input.checklist_items.map((item)=> {return {name: item, completed: false, goal_id: goal.id }})
          // create new 
          await ctx.prisma.checkListItem.createMany({
            data: new_items
          })
        }


        return goal


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

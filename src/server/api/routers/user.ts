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
  resetUserStats: publicProcedure
  .mutation(async ({ctx})=> {
    return await ctx.prisma.stats.updateMany({
        where: {
            user_id: 1
        },
        data: {
            current_points: 0,
            total_points: 0,
            level: 1
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


      await ctx.prisma.pointsData.create({
        data: {
            user_id: 1,
            points: points_added.total_points,
            date: today.toISOString(),
            category: input.category
        }
      })

      return points_added;
    }),
  gainLevel: publicProcedure
    .input(z.object({ overflow: z.number(), category: goal_categories }))
    .mutation(async ({ ctx, input }) => {
        const today = new Date()
      const new_level = await ctx.prisma.stats.update({
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
          current_points: input.overflow
        },
      });
      await ctx.prisma.levelData.create({
        data: {
            user_id: 1,
            level: new_level.level,
            date: today.toISOString(),
            category: input.category
        }
      })

      // update, if doesn't exist just catch and ignore error 
      await ctx.prisma.rewards.update({
        where: {
            user_id_level_category: {
                user_id: 1,
                level: new_level.level,
                category: input.category
            }
        },
        data: {
            achieved_at: today.toISOString()
        }
      }).catch((err)=> console.log(err))


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
    addUser: publicProcedure
    .mutation(async ({ctx})=> {

        const c = goal_categories.Values
        const categories = [
            {category: c.Education},
            {category: c.Social},
            {category: c.Hobby},
            {category: c.Physical},
            {category: c.Odd_Job}
        ]
        const new_user = ctx.prisma.user.create({
            data: {
                stats: {
                    createMany: {
                        data: categories
                    }
                },
                level_data: {
                    createMany: {
                        data: categories
                    },
                },
                points_data: {
                    createMany: {
                        data: categories
                    }
                },
            }
        })

        return new_user
    })
});

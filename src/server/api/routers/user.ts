import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { goal_categories } from "./goals";

export type UserSubscription = {
  pushSubscription: {
    endpoint: string | null;
    keys: {
      p256dh: string | null;
      auth: string | null;
    };
  };
};

export const userRouter = createTRPCRouter({
  getCurrentUserInfo: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  getUserSubscription: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        subscription: true,
      },
    });

    const subscription = JSON.parse(
      data?.subscription as string
    ) as UserSubscription;

    return subscription.pushSubscription;
  }),
  getUserStats: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        stats: true,
      },
    });
  }),
  resetUserStats: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.stats.updateMany({
      where: {
        user_id: ctx.session.user.id,
      },
      data: {
        current_points: 0,
        total_points: 0,
        level: 1,
      },
    });
  }),
  getCategoryLevel: protectedProcedure
    .input(z.object({ category: goal_categories }))
    .query(({ ctx, input }) => {
      return ctx.prisma.stats.findUnique({
        where: {
          user_id_category: {
            user_id: ctx.session.user.id,
            category: input.category,
          },
        },
        select: {
          level: true,
        },
      });
    }),
  getCategoryCurrentPoints: protectedProcedure
    .input(z.object({ category: goal_categories }))
    .query(({ ctx, input }) => {
      return ctx.prisma.stats.findUnique({
        where: {
          user_id_category: {
            user_id: ctx.session.user.id,
            category: input.category,
          },
        },
        select: {
          current_points: true,
        },
      });
    }),
  addPoints: protectedProcedure
    .input(z.object({ points: z.number(), category: goal_categories }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date();

      // only do one mutation if all of them succeed 
      return await ctx.prisma.$transaction(async (tx) => {
        const points_added = await tx.stats.update({
          where: {
            user_id_category: {
              user_id: ctx.session.user.id,
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

        await tx.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            last_points_added: today,
          },
        });

        await ctx.prisma.pointsData.create({
          data: {
            user_id: ctx.session.user.id,
            points: points_added.total_points,
            date: today,
            category: input.category,
          },
        });

        return points_added;
      });

      
    }),
  gainLevel: protectedProcedure
    .input(z.object({ overflow: z.number(), category: goal_categories }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date();
      const new_level = await ctx.prisma.stats.update({
        where: {
          user_id_category: {
            user_id: ctx.session.user.id,
            category: input.category,
          },
        },
        data: {
          level: {
            increment: 1,
          },
          current_points: input.overflow,
        },
      });
      await ctx.prisma.levelData.create({
        data: {
          user_id: ctx.session.user.id,
          level: new_level.level,
          date: today,
          category: input.category,
        },
      });

      // update, if doesn't exist just catch and ignore error
      await ctx.prisma.rewards
        .update({
          where: {
            user_id_level_category: {
              user_id: ctx.session.user.id,
              level: new_level.level,
              category: input.category,
            },
          },
          data: {
            achieved_at: today,
          },
        })
        .catch((err) => console.log(err));

      return new_level;
    }),
  saveSubscription: protectedProcedure
    .input(z.object({ json: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const new_subscription = ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          subscription: input.json,
        },
      });
      return new_subscription;
    }),
  checkIfNewUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        stats: true,
      },
    });

    return user ? user.stats.length === 0 : true;
  }),
  addUser: protectedProcedure.mutation(async ({ ctx }) => {
    const c = goal_categories.Values;
    const categories = [
      { category: c.Education },
      { category: c.Social },
      { category: c.Hobby },
      { category: c.Physical },
      { category: c.Odd_Job },
    ];

    const new_user = ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        stats: {
          createMany: {
            data: categories,
          },
        },
        level_data: {
          createMany: {
            data: categories,
          },
        },
        points_data: {
          createMany: {
            data: categories,
          },
        },
      },
    });

    return new_user;
  }),
});

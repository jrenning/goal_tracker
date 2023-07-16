import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { goal_categories } from "./goals";

export const userRouter = createTRPCRouter({
  getCurrentUserInfo: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst();
  }),
  addPoints: publicProcedure
    .input(z.object({ points: z.number(), category: goal_categories }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date();
      let points_added;
      if (input.category == "Education") {
        points_added = ctx.prisma.user.updateMany({
          data: {
            current_points_education: {
              increment: input.points,
            },
            total_points_education: {
              increment: input.points,
            },
            last_points_added: today.toISOString(),
          },
        });
      } else if (input.category == "Physical") {
        points_added = ctx.prisma.user.updateMany({
          data: {
            current_points_physical: {
              increment: input.points,
            },
            total_points_physical: {
              increment: input.points,
            },
            last_points_added: today.toISOString(),
          },
        });
      } else if (input.category == "Social") {
        points_added = ctx.prisma.user.updateMany({
          data: {
            current_points_social: {
              increment: input.points,
            },
            total_points_social: {
              increment: input.points,
            },
            last_points_added: today.toISOString(),
          },
        });
      } else if (input.category == "Hobby") {
        points_added = ctx.prisma.user.updateMany({
          data: {
            current_points_hobby: {
              increment: input.points,
            },
            total_points_hobby: {
              increment: input.points,
            },
            last_points_added: today.toISOString(),
          },
        });
      } else {
        points_added = ctx.prisma.user.updateMany({
          data: {
            current_points_odd_job: {
              increment: input.points,
            },
            total_points_odd_job: {
              increment: input.points,
            },
            last_points_added: today.toISOString(),
          },
        });
      }
      return points_added;
    }),
  gainLevel: publicProcedure
    .input(z.object({ overflow: z.number(), category: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let new_level;
      if (input.category == "Physical") {
        new_level = ctx.prisma.user.updateMany({
          data: {
            level_physical: {
              increment: 1,
            },
            current_points_physical: input.overflow,
          },
        });
      } else if (input.category == "Education") {
        new_level = ctx.prisma.user.updateMany({
          data: {
            level_education: {
              increment: 1,
            },
            current_points_education: input.overflow,
          },
        });
      } else if (input.category == "Social") {
        new_level = ctx.prisma.user.updateMany({
          data: {
            level_social: {
              increment: 1,
            },
            current_points_social: input.overflow,
          },
        });
      } else if (input.category == "Hobby") {
        new_level = ctx.prisma.user.updateMany({
          data: {
            level_hobby: {
              increment: 1,
            },
            current_points_hobby: input.overflow,
          },
        });
      } else {
        new_level = ctx.prisma.user.updateMany({
          data: {
            level_odd_job: {
              increment: 1,
            },
            current_points_odd_job: input.overflow,
          },
        });
      }
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

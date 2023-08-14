import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { goal_categories } from "./goals";
import { PrismaClient } from "@prisma/client";
import { GoalCategories } from "~/pages";
import { Session } from "next-auth";

const level_data = z.object({
  number: z.number(),
  points: z.number(),
});

async function fetchPointData(
  prisma: PrismaClient,
  session: Session,
  category: GoalCategories
) {
  const data = await prisma.stats.findUnique({
    where: {
      user_id_category: {
        //@ts-ignore
        user_id: session.user.id,
        category: category,
      },
    },
  });
  const level = await prisma.levels.findFirstOrThrow({
    where: {
      number: data?.level,
    },
  });
  return {
    current_points: data?.current_points,
    max_points: level.points,
  };
}

async function handleLevelUp(
  prisma: PrismaClient,
  session: Session,
  category: GoalCategories,
  overflow: number
) {
  const today = new Date();

  return await prisma.$transaction(async (tx) => {
    const new_level = await tx.stats.update({
      where: {
        user_id_category: {
          //@ts-ignore
          user_id: session.user.id,
          category: category,
        },
      },
      data: {
        level: {
          increment: 1,
        },
        current_points: overflow,
      },
    });
    await tx.levelData.create({
      data: {
        //@ts-ignore
        user_id: session.user.id,
        level: new_level.level,
        date: today,
        category: category,
      },
    });

    // update, if doesn't exist just catch and ignore error
    await tx.rewards
      .update({
        where: {
          user_id_level_category: {
            //@ts-ignore
            user_id: session.user.id,
            level: new_level.level,
            category: category,
          },
        },
        data: {
          achieved_at: today,
        },
      })
      .catch((err) => console.log(err));

    return new_level;
  });
}

export const levelRouter = createTRPCRouter({
  getLevels: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.levels.findMany();
  }),
  getLevel: publicProcedure
    .input(z.object({ level: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.levels.findFirstOrThrow({
        where: {
          number: input.level,
        },
      });
    }),
  gainLevel: protectedProcedure
    .input(z.object({ category: goal_categories }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        let { current_points, max_points } = await fetchPointData(
          ctx.prisma,
          ctx.session,
          input.category
        );

        let level_up = false;
        let level = undefined;

        if (current_points && max_points) {
          while (current_points <= max_points) {
            level_up = true;
            level = await handleLevelUp(
              ctx.prisma,
              ctx.session,
              input.category,
              max_points - current_points
            );
            current_points = current_points - max_points;
            ({ max_points } = await fetchPointData(
              ctx.prisma,
              ctx.session,
              input.category
            ));
          }
        }

        return {
          level_up: level_up,
          new_level: level
        }
      });
    }),
  createLevel: protectedProcedure
    .input(z.object({ level: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.levels.create({
        data: {
          number: input.level,
          points: 20,
        },
      });
    }),
  createLevels: protectedProcedure
    .input(z.object({ levels: z.array(level_data) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.levels.createMany({
        data: input.levels,
      });
    }),
});

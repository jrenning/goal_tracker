import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const level_data = z.object({
  number: z.number(),
  points: z.number()
})

export const levelRouter = createTRPCRouter({
  getLevels: publicProcedure
    .query(({ctx}) => {
      return ctx.prisma.levels.findMany()
    }),
    getLevel: publicProcedure
    .input(z.object({ level: z.number() }))
    .query(({input, ctx})=> {
        return ctx.prisma.levels.findFirstOrThrow({
            where: {
                number: input.level
            }
        })
    }),
    createLevel: protectedProcedure
    .input(z.object({level: z.number()}))
    .mutation(({ctx, input})=> {
      return ctx.prisma.levels.create({
        data: {
          number: input.level,
          points: 20
        }
      })
    }),
    createLevels: protectedProcedure
    .input(z.object({levels: z.array(level_data)}))
    .mutation(({ctx, input})=> {
      return ctx.prisma.levels.createMany({
        data: input.levels
      })
    })
});

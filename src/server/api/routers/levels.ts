import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const levelRouter = createTRPCRouter({
  getLevels: publicProcedure
    .query(({ctx}) => {
      return ctx.prisma.levels.findMany()
    }),
    getLevel: publicProcedure
    .input(z.object({ level: z.number() }))
    .query(({input, ctx})=> {
        return ctx.prisma.levels.findFirst({
            where: {
                number: input.level
            }
        })
    })
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { goal_categories } from "./goals";
import {EventTypes, TimeFrame} from "@prisma/client"
import { reward_categories } from "./rewards";

export const acheievmentsRouter = createTRPCRouter({
    getAcheievmentList: publicProcedure
    .query(({ctx})=> {
        return ctx.prisma.achievement.findMany({
            select: {
                name: true
            }
        })
    }),
    getUserAcheievments: protectedProcedure
    .query(({ctx})=> {
        return ctx.prisma.userAchievement.findMany({
            where: {
                user_id: ctx.session.user.id
            }
        })
    }),
    createAchievements: protectedProcedure
    .input(z.object({achievements: z.array(z.object({
        name: z.string(),
        event: z.nativeEnum(EventTypes),
        value: z.number(),
        time_frame: z.nativeEnum(TimeFrame).optional(),
        goal_category: goal_categories,
        reward_category: reward_categories.optional()
    }))}))
    .mutation(({ctx, input})=> {
        return ctx.prisma.achievement.createMany({
            data: input.achievements
        })
    })
})
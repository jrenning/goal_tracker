import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { days_of_week, goal_categories, repeat_type } from "./goals";
import { TRPCError } from "@trpc/server";

export const shopRouter = createTRPCRouter({
  getShopItems: protectedProcedure.query(({ ctx, input }) => {
    const today = new Date();
    return ctx.prisma.shopItem.findMany({
      where: {
        user_id: ctx.session.user.id,
        bought: false,
        // expire_at: {
        //   lte: today,
        // },
      },
    });
  }),
  createShopItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        cost: z.number(),
        expire_at: z.date().optional(),
        repeat_type: repeat_type.optional(),
        days_of_week: z.array(days_of_week).optional(),
        repeat_freq: z.number().optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        const item = await tx.shopItem.create({
          data: {
            user_id: ctx.session.user.id,
            name: input.name,
            cost: input.cost,
            expire_at: input.expire_at,
            bought: false,
          },
        });
        if (input.repeat_type) {
          await tx.shopRepeatData.create({
            data: {
              item_id: item.id,
              repeat_frequency: input.repeat_freq,
              days: input.days_of_week,
              start_date: input.start_date,
              stop_date: input.end_date,
              type: input.repeat_type,
            },
          });
        }

        return item;
      });
    }),
  buyShopItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        // check for enough money
        const coins = await ctx.prisma.inventory.findUnique({
          where: {
            user_id: ctx.session.user.id,
          },
          select: {
            coins: true,
          },
        });

        const item = await tx.shopItem.findUnique({
          where: {
            id: input.id,
          },
        });

        if (coins && item) {
          if (coins.coins < item.cost) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Not enough coins to buy this item",
            });
          } else {
            // if enough buy item
            await tx.shopItem.update({
              where: {
                id: input.id,
              },
              data: {
                bought: true,
              },
            });

            await tx.inventory.update({
              where: {
                user_id: ctx.session.user.id
              },
              data: {
                coins: {
                  decrement: item.cost
                }
              }
            })

            return item
          }
        }
      });
    }),
});

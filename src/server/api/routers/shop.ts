import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { days_of_week, goal_categories, repeat_type } from "./goals";
import { TRPCError } from "@trpc/server";
import { Session } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { filterItemsInRange } from "~/utils/goals";
import { reward_categories } from "./rewards";
import { calculateCostAndDiscount } from "~/utils/shop";


export const rarities = z.enum(["Common", "Rare", "Epic", "Legendary"])


export async function getShopItemsInRange(
  prisma: PrismaClient,
  session: Session,
  start: Date,
  end: Date
) {
  const shop_in_range = await prisma.shopItem.findMany({
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

  return shop_in_range;
}

export async function getRepeatingShopItemsInRange(
  prisma: PrismaClient,
  session: Session,
  start: Date,
  end: Date
) {
  const items_in_range = await getShopItemsInRange(prisma, session, start, end);


  const filtered_goals = filterItemsInRange(items_in_range, start, end);


  return filtered_goals;
}

export const shopRouter = createTRPCRouter({
  clear: protectedProcedure
  .mutation(({ctx, input})=> {
    return ctx.prisma.shopItem.deleteMany({
      where: {
        user_id: ctx.session.user.id
      }
    })
  }),
  getShopItemById: protectedProcedure
  .input(z.object({id: z.number()}))
  .query(({ctx, input})=> {
    return ctx.prisma.shopItem.findUnique({
      where: {
        id: input.id
      },
      include: {
        repeat: true,
      }
    })
  }),
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
  getRepeatingItemsByDate: protectedProcedure
  .input(z.object({date: z.date()}))
  .query(({ctx, input})=> {
    return getRepeatingShopItemsInRange(ctx.prisma, ctx.session, input.date, input.date)
  }),
  createShopItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        rarity: rarities,
        reward_category: reward_categories,
        expire_at: z.date().optional(),
        repeat_type: repeat_type.optional(),
        days_of_week: z.array(days_of_week).optional(),
        repeat_freq: z.number().optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {cost, discount} = calculateCostAndDiscount(input.rarity, input.expire_at)
      return await ctx.prisma.$transaction(async (tx) => {
        const item = await tx.shopItem.create({
          data: {
            user_id: ctx.session.user.id,
            name: input.name,
            reward_category: input.reward_category,
            rarity: input.rarity,
            cost: cost,
            discount_multiplier: discount,
            expire_at: input.expire_at,
            bought: input.repeat_type ? true : false,
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
                user_id: ctx.session.user.id,
              },
              data: {
                coins: {
                  decrement: item.cost,
                },
              },
            });

            return item;
          }
        }
      });
    }),
});

import { test, expect, beforeAll, afterAll, describe } from "vitest";
import { prisma } from "../../db";
import { appRouter, type AppRouter } from "../root";
import { beforeEach, afterEach } from "vitest";
import { calculateCostAndDiscount } from "~/utils/shop";

const session = {
  user: {
    id: "test",
    name: "John Doe",
  },
  expires: "1",
};

const caller = appRouter.createCaller({
  prisma: prisma,
  session: session,
});

beforeAll(async () => {
  await caller.tests.createTestUser();
});

afterAll(async () => {
  await caller.tests.cleanUp();
});

beforeEach(async()=> {
    await caller.shop.createShopItem({
        name: "Test",
        reward_category: "Food",
        rarity: "Common",
    })
})

afterEach(async () => {
    await caller.shop.clear()
})

test("Test clear", async ()=> {
    await caller.shop.createShopItem({
        name: "Test 2",
        reward_category: "Food",
        rarity: "Rare"
    })

    await caller.shop.clear()

    const data = await caller.shop.getShopItems()

    expect(data).lengthOf(0)
})


describe("Test getting shop items", () => {
    test("Test getting non-bought items", async ()=> {

        const item = await caller.shop.createShopItem({
          name: "Test 3",
          reward_category: "Food",
          rarity: "Rare",
        });
        const initial = await caller.shop.getShopItems()

        expect(initial).lengthOf(2)

        // buy item 
        await caller.user.addCoins({coins: 10000})
        await caller.shop.buyShopItem({
            id: item.id
        })

        const data = await caller.shop.getShopItems()

        expect(data).lengthOf(1)


    })
})


describe("Test creating shop items", ()=> {
    test("Test creating simple item", async ()=> {
        const data = await caller.shop.createShopItem({
            name: "Test Basic",
            rarity: "Common",
            reward_category: "Food"
        })

        const {cost, discount} = calculateCostAndDiscount(data.rarity, data.expire_at)

        const discounts = [1, 0.75, 0.9, 0.5]

        expect(data.bought).toBe(false)
        expect(data.cost).toBe(cost)
        expect(data.created_at).toBeDefined()
        expect(data.discount_multiplier).toBeDefined()
        expect(data.rarity).toBe("Common")
        expect(data.reward_category).toBe("Food")
        expect(discounts.includes(data.discount_multiplier)).toBeTruthy()
    })

    test("Test creating repeating item", async ()=> {
        const item = await caller.shop.createShopItem({
            name: "Test Repeating",
            reward_category: "Food",
            rarity: "Epic",
            repeat_freq: 1,
            repeat_type: "Weekly",
            days_of_week: ["Monday", "Wednesday"],
            start_date: new Date()
            
        })

        const data = await caller.shop.getShopItemById({
            id: item.id
        })

        expect(data?.repeat?.days).toStrictEqual(["Monday", "Wednesday"])
        expect(data?.repeat?.last_repeated).toBeNull()
        expect(data?.repeat?.repeat_frequency).toBe(1)
        expect(data?.repeat?.start_date.toDateString()).toBe(new Date().toDateString())

    })
})
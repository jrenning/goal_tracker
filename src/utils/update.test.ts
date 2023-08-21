import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from "vitest";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { updateRepeatingGoals, updateRepeatingShopItems } from "./update";

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

beforeEach(async () => {
  await caller.shop.createShopItem({
    name: "Test",
    cost: 10,
    repeat_freq: 1,
    repeat_type: "Daily",
    start_date: new Date(2022, 1, 1),
  });

  await caller.goals.addGoal({
    name: "Test Repeat Daily",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Daily",
    start_date: new Date(2023, 0, 1),
  });
});

afterEach(async () => {
  await caller.shop.clear();
  await caller.goals.clear();
});

// This test is only to confirm that the update function correctly creates the shop items,
// NOT the code that determines if a item should repeat on a date
test("Test update working for shop items", async () => {
  const pre_add = await caller.shop.getShopItems();

  expect(pre_add).lengthOf(1);

  const added = await updateRepeatingShopItems(session);

  expect(added).toBe(1)

//   const data = await caller.shop.getShopItems();

  

//   expect(data).lengthOf(2);
});

test("Test update working for goals", async () => {
  const pre_add = await caller.goals.getCurrentGoals();

  expect(pre_add).lengthOf(1);

  const added = await updateRepeatingGoals(session);

  expect(added).toBe(1)

//   const data = await caller.goals.getAllGoals();


//   expect(data).lengthOf(2);
});

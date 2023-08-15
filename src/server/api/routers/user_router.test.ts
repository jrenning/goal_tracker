import { test, expect, beforeAll, afterAll, describe } from "vitest";
import { prisma } from "../../db";
import { appRouter, type AppRouter } from "../root";
import { beforeEach, afterEach } from "vitest";

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

test("Test get current user info", async () => {
  const data = await caller.user.getCurrentUserInfo();

  expect(data.id).toBe("test");
});

describe("Test subscriptions", () => {
  const sub = {
    pushSubscription: {
      endpoint: "https://hello",
      keys: {
        p256dh: "test_key",
        auth: "test_auth",
      },
    },
  };
  test("Test setting subscription", async () => {
    const data = await caller.user.saveSubscription({
      json: sub,
    });

    expect(data.subscription).toStrictEqual(sub)
  });

  test("Test getting subscription", async () => {
    const data = await caller.user.getUserSubscription();

    expect(data).toStrictEqual(sub);
  });
});


// test("Test creation of a new user", async ()=> {
//     const data = await caller.user.addUser()

//     // check all catgeories are created 
//     expect(data.stats.length).toBe(5)

//     expect(data.inventory?.coins).toBe(0)

//     expect(data.level_data.length).toBe(0)
//     expect(data.points_data.length).toBe(0)

// })

test("Test adding points", async ()=> {
    await caller.user.addPoints({
        points: 10,
        category: "Physical"
    })

    const data = await caller.user.getUserStats()

    const stat = data?.stats.filter((stat) => stat.category == "Physical")[0]
    expect(stat?.current_points).toBe(10)
    expect(stat?.total_points).toBe(10)

    const point_data = await caller.history.getAllPointDataByCategory({
      category: "Physical",
    });

    expect(point_data.length).toBe(1)

})

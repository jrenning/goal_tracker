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
  await caller.levels.createLevel({
    level: 1,
    points: 100,
  });
  await caller.levels.createLevel({
    level: 2,
    points: 150,
  });
  await caller.levels.createLevel({
    level: 3,
    points: 200
  })
});

afterAll(async () => {
  await caller.tests.cleanUp();
  await caller.levels.deleteAllLevels();
});

afterEach(async () => {
  await caller.user.resetUserStats();
});

test("Test creating levels", async () => {
  const levels = await caller.levels.createLevels({
    levels: [
      {
        number: 4,
        points: 200,
      },
      {
        number: 5,
        points: 250,
      },
      {
        number: 6,
        points: 300,
      },
    ],
  });

  expect(levels.count).toBe(3);
});

describe("Test level up", () => {
  test("Test leveling up once", async () => {
    // set current category points to above max
    const level_max = await caller.levels.getLevel({
      level: 1,
    });
    await caller.user.addPoints({
      points: level_max.points + 10,
      category: "Physical",
    });
    // call the handle level up
    const data = await caller.levels.gainLevel({
      category: "Physical",
    });
    expect(data.level_up).toBe(true);
    expect(data.new_level?.level).toBe(2);
    expect(data.new_level?.current_points).toBe(10);
    expect(data.new_level?.total_points).toBe(level_max.points + 10);
  });

  test("Test not leveling up", async () => {
    const level_max = await caller.levels.getLevel({
      level: 1,
    });
    await caller.user.addPoints({
      points: Math.floor(level_max.points / 2),
      category: "Physical",
    });
    // call the handle level up
    const data = await caller.levels.gainLevel({
      category: "Physical",
    });

    expect(data.level_up).toBe(false);
    expect(data.new_level?.level).toBeUndefined();
  });

  test("Test leveling up multiple times", async () => {
    const level_one = await caller.levels.getLevel({
      level: 1,
    });
    const level_two = await caller.levels.getLevel({
      level: 2,
    });
    await caller.user.addPoints({
      points: level_one.points + level_two.points + 10,
      category: "Physical",
    });
    // call the handle level up
    const data = await caller.levels.gainLevel({
      category: "Physical",
    });
    expect(data.level_up).toBe(true);
    expect(data.new_level?.level).toBe(3);
    expect(data.new_level?.current_points).toBe(10);
    expect(data.new_level?.total_points).toBe(level_one.points + level_two.points + 10);
  });
});

import { test, expect, beforeAll, afterAll, describe } from "vitest";
import { createInnerTRPCContext } from "../trpc";
import { prisma } from "../../db";
import { appRouter, type AppRouter } from "../root";
import { beforeEach, afterEach } from "vitest";
import { inferProcedureInput } from "@trpc/server";
import { getRepeatingGoalsInRange } from "./goals";
import { convertToUTC } from "~/utils/datetime";
import { Goals } from "@prisma/client";
import { GoalCategories } from "~/pages";
import { calculateCoins, calculateExp } from "~/utils/goals";

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

let todayUTC = new Date();
todayUTC.setUTCHours(0, 0, 0, 0);

type AddGoalInput = inferProcedureInput<AppRouter["goals"]["addGoal"]>;

const basic_goals: AddGoalInput[] = [
  {
    name: "Test 1",
    difficulty: 1,
    category: "Physical",
  },
  {
    name: "Test 2",
    difficulty: 1,
    category: "Physical",
  },
  {
    name: "Test 3",
    difficulty: 1,
    category: "Social",
  },
];

const repeating_goals: AddGoalInput[] = [
  {
    name: "Test Repeat Daily",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Daily",
    start_date: new Date(2023, 0, 1),
  },
  {
    name: "Test Repeat Daily (Every 3 days)",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Daily",
    repeat_freq: 3,
    start_date: new Date(2023, 0, 1),
  },
  {
    name: "Test Repeat Weekly M W F End 2/25/2023",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Weekly",
    days_of_week: ["Monday", "Wednesday", "Friday"],
    start_date: new Date(2023, 0, 1),
    end_date: new Date(2023, 1, 25),
  },
  {
    name: "Test Repeat Weekly M W F (Every 2 weeks)",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Weekly",
    repeat_freq: 2,
    days_of_week: ["Monday", "Wednesday", "Friday"],
    start_date: new Date(2023, 0, 1),
  },
  {
    name: "Test Repeat Weekly M W F (Every 6 weeks)",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Weekly",
    repeat_freq: 6,
    days_of_week: ["Monday", "Wednesday", "Friday"],
    start_date: new Date(2023, 0, 1),
  },
  {
    name: "Test Repeat Weekly T Th End 2/25/2023",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Weekly",
    days_of_week: ["Thursday", "Tuesday"],
    start_date: new Date(2023, 0, 1),
    end_date: new Date(2023, 1, 25),
  },
  {
    name: "Test Repeat Monthly End 2/25/2023",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Monthly",
    start_date: new Date(2023, 0, 1),
    end_date: new Date(2023, 1, 25),
  },
  {
    name: "Test Repeat Monthly (Every 2 months)",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Monthly",
    repeat_freq: 2,
    start_date: new Date(2023, 0, 1),
  },
  {
    name: "Test Repeat Yearly End 2/25/2024",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Yearly",
    start_date: new Date(2023, 0, 1),
    end_date: new Date(2024, 1, 25),
  },
  {
    name: "Test Repeat Yearly (Every 2 years)",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Yearly",
    repeat_freq: 2,
    start_date: new Date(2023, 0, 1),
  },
];

const due_date_goals: AddGoalInput[] = [
  {
    name: "Test Due Date 2/25",
    difficulty: 1,
    category: "Physical",
    due_date: new Date(2023, 1, 25),
  },
  {
    name: "Test Due Date 1/1",
    difficulty: 1,
    category: "Physical",
    due_date: new Date(2023, 0, 1),
  },
  {
    name: "Test Due Date Today",
    difficulty: 1,
    category: "Physical",
    due_date: todayUTC,
  },
];

beforeAll(async () => {
  await caller.tests.createTestUser();
});

afterAll(async () => {
  await caller.tests.cleanUp();
});

beforeEach(async () => {
  // for loops to prevent weird ordering
  // ADD BASIC GOALS
  for (const goal of basic_goals) {
    await caller.goals.addGoal(goal);
  }

  // ADD REPEATING GOALS
  for (const goal of repeating_goals) {
    await caller.goals.addGoal(goal);
  }

  // ADD DUE DATE GOALS
  for (const goal of due_date_goals) {
    await caller.goals.addGoal(goal);
  }
});

afterEach(async () => {
  await caller.goals.clear();
  await caller.user.resetUserStats();
});

test("test clear", async () => {
  await caller.goals.addGoal({
    name: "Test Clear",
    difficulty: 1,
    category: "Physical",
  });

  await caller.goals.clear();
  const data = await caller.goals.getCurrentGoals();

  expect(data).lengthOf(0);
});

describe("get repeating goals in range", async () => {
  test.each([
    {
      start: new Date(2023, 0, 1),
      end: new Date(2023, 0, 1),
      expected_length: 6,
    },
    {
      start: new Date(2023, 0, 1),
      end: new Date(2023, 1, 1),
      expected_length: 10,
    },
    {
      start: new Date(2023, 0, 2),
      end: new Date(2023, 0, 2),
      expected_length: 4,
    },
    {
      start: new Date(2023, 0, 9),
      end: new Date(2023, 0, 9),
      expected_length: 2,
    },
    {
      start: new Date(2023, 0, 7),
      end: new Date(2023, 0, 9),
      expected_length: 3,
    },
    {
      start: new Date(2023, 0, 14),
      end: new Date(2023, 0, 16),
      expected_length: 4,
    },
    {
      start: new Date(2023, 0, 3),
      end: new Date(2023, 0, 3),
      expected_length: 2,
    },
    {
      start: new Date(2023, 0, 3),
      end: new Date(2023, 0, 8),
      expected_length: 6,
    },
    {
      start: new Date(2023, 1, 5),
      end: new Date(2023, 1, 17),
      expected_length: 6,
    },
    {
      start: new Date(2023, 11, 31),
      end: new Date(2024, 0, 1),
      expected_length: 4,
    },
  ])(
    "range($start - $end) -> $expected_length",
    async ({ start, end, expected_length }) => {
      const data = await getRepeatingGoalsInRange(prisma, session, start, end);
      expect.soft(data).lengthOf(expected_length);
    }
  );
});

describe("get due dates in month", () => {
  test.each([
    { date: new Date(2023, 0, 31), expected_length: 1 },
    { date: new Date(2023, 1, 28), expected_length: 1 },
    {
      date: convertToUTC(new Date(2023, new Date().getMonth() + 1, 0)),
      expected_length: 1,
    },
  ])("In month ending at $date", async ({ date, expected_length }) => {
    const data = await caller.goals.getDueDatesInMonth({
      date: date,
    });
    expect.soft(data).lengthOf(expected_length);
  });
});

test("get due dates today", async () => {
  const data = await caller.goals.getDueDatesToday();

  expect(data).toHaveLength(1);
});

test("set last repeat", async () => {
  const goal = await caller.goals.addGoal({
    name: "Test Repeat Daily",
    difficulty: 1,
    category: "Physical",
    repeat_type: "Daily",
    start_date: new Date(2023, 0, 1),
  });

  await caller.goals.setLastRepeat({
    id: goal ? goal.id : 1,
  });

  const data = await caller.goals.getGoalById({
    id: goal ? goal.id : 1,
  });
  expect(data?.repeat?.last_repeated).toBeDefined();
});

describe("Test getting current goals", () => {
  test("get all goals", async () => {
    const data = await caller.goals.getCurrentGoals();

    expect(data.length).toBe(
      basic_goals.length + repeating_goals.length + due_date_goals.length
    );
  });
  test("test ordering by due date", async () => {
    const data = await caller.goals.getCurrentGoals();

    expect(data[0]?.name).toBe("Test Due Date 1/1");
    expect(data[1]?.name).toBe("Test Due Date 2/25");
  });

  test("getting less after completing one", async () => {
    const current = await caller.goals.getCurrentGoals();
    await caller.goals.completeGoal({
      //@ts-ignore
      id: current[0].id,
    });
    const data = await caller.goals.getCurrentGoals();
    expect(data.length).toBe(
      basic_goals.length + repeating_goals.length + due_date_goals.length - 1
    );
  });
});

describe("Test adding goal", () => {
  test("Test adding basic goal", async () => {
    const category: GoalCategories = "Physical";
    const goal = {
      name: "Test Add",
      difficulty: 1,
      category: category,
    };
    const data = await caller.goals.addGoal(goal);

    expect(data?.name).toBe(goal.name);
    expect(data?.difficulty).toBe(goal.difficulty);
    expect(data?.category).toBe(goal.category);
    expect(data?.points).toBe(2);
    expect(data?.completed).toBe(false);
    expect(data?.created_at).toBeDefined();
    expect(data?.date_completed).toBeNull();
    expect(data?.due_date).toBeNull();
  });

  test("Test adding goal with checklist", async () => {
    const checklist = ["Item 1", "Item 2"];
    const data = await caller.goals.addGoal({
      name: "Test Checklist",
      difficulty: 1,
      category: "Physical",
      checklist_items: checklist,
    });

    expect(data?.checklist.map((item) => item.name)).toStrictEqual(checklist);
  });

  test("Test adding with repeat", async () => {
    const data = await caller.goals.addGoal({
      name: "Test Checklist",
      difficulty: 1,
      category: "Physical",
      repeat_type: "Weekly",
      days_of_week: ["Monday", "Friday"],
      repeat_freq: 3,
      start_date: convertToUTC(new Date(2023, 0, 1)),
    });

    expect(data?.repeat?.type).toBe("Weekly");
    expect(data?.repeat?.days).toStrictEqual(["Monday", "Friday"]);
    expect(data?.repeat?.last_repeated).toBeNull();
    expect(data?.repeat?.repeat_frequency).toBe(3);
    expect(data?.repeat?.start_date).toStrictEqual(
      convertToUTC(new Date(2023, 0, 1))
    );
    expect(data?.repeat?.stop_date).toBeNull();
  });

  test("Adding goal with repeat type and due date", async () => {
    expect(
      async () =>
        await caller.goals.addGoal({
          name: "Test Checklist",
          difficulty: 1,
          category: "Physical",
          repeat_type: "Weekly",
          due_date: new Date(2023, 1, 1),
          days_of_week: ["Monday", "Friday"],
          repeat_freq: 3,
          start_date: convertToUTC(new Date(2023, 0, 1)),
        })
    ).rejects.toThrowError("due date");
  });

  test("Adding goal with start date greater than end", async () => {
    expect(
      async () =>
        await caller.goals.addGoal({
          name: "Test Checklist",
          difficulty: 1,
          category: "Physical",
          repeat_type: "Weekly",
          days_of_week: ["Monday", "Friday"],
          repeat_freq: 3,
          start_date: convertToUTC(new Date(2023, 0, 1)),
          end_date: new Date(2020, 0, 1),
        })
    ).rejects.toThrowError("start date");
  });
});

test("Test completing a goal", async () => {
  const goal = await caller.goals.addGoal({
    name: "Test Complete",
    difficulty: 1,
    category: "Physical",
  });

  if (goal) {
    await caller.goals.completeGoal({
      id: goal.id,
    });

    const data = await caller.goals.getGoalById({
      id: goal.id,
    });

    expect(data?.completed).toBe(true);
    expect(data?.date_completed).toBeDefined();

    const point_data = await caller.user.getCategoryCurrentPoints({
      category: "Physical",
    });
    const exp = calculateExp(1, 0, undefined, false);
    expect(point_data?.current_points).toBe(exp);

    const gold_data = await caller.user.getUserCoins();

    // account for other complete call
    expect(gold_data?.coins).toBe(calculateCoins(exp) + 2);
  }
});

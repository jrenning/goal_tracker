import { test, expect, beforeAll, afterAll, describe } from "vitest";
import { createInnerTRPCContext } from "../trpc";
import { prisma } from "../../db";
import { appRouter, type AppRouter } from "../root";
import { beforeEach, afterEach } from "vitest";
import { inferProcedureInput } from "@trpc/server";

const caller = appRouter.createCaller({
  prisma: prisma,
  session: {
    user: {
      id: "test",
      name: "John Doe",
    },
    expires: "1",
  },
});

test("test create test user", async ()=> {
    const data = await caller.tests.createTestUser()
    expect(data).toHaveProperty("id", "test")
})


test("test clear all data", async ()=> {
    await caller.goals.addGoal({
        name: "Test",
        difficulty: 1,
        exp: 10,
        category: "Physical"
    })
    await caller.tests.cleanUp()

    const data  = await caller.goals.getCurrentGoals()

    expect(data).toHaveLength(0)

    const user = await caller.user.getUserStats()

    expect(user).toBe(null)


})

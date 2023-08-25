import { beforeAll, test } from "vitest";
import { appRouter, type AppRouter } from "../root";
import { prisma } from "~/server/db";
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

beforeAll(async()=> {
    await caller.tests.cleanUp()
})


test("Test", ()=> {

})
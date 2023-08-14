
import { Session } from "next-auth";
import { prisma } from "~/server/db";
import { api } from "./api";
import { appRouter } from "~/server/api/root";

export const updateRepeatingGoals = async (session: Session) => {


    const today = new Date();
    const caller = await appRouter.createCaller({
        prisma: prisma,
        session: session,
      });
    const goalsToRepeat = await caller.goals.getRepeatingGoalsByDate({
      date: new Date()
    })

    // filter out ones that are already repeated 
    const filteredGoals = goalsToRepeat && goalsToRepeat.filter((goal)=> goal.repeat?.last_repeated?.toDateString() != today.toDateString())

    // add new goal if needed, DON'T ADD REPEATING DATA (avoids never ending tasks)

    if (filteredGoals && session.user) {
      filteredGoals.map(async (goal)=> {
      if (session.user) {
        await prisma.goals.create({
          data: {
            user_id: session.user.id,
            name: goal.name,
            points: goal.points,
            difficulty: goal.difficulty,
            completed: false,
            category: goal.category,
          },
        });
        // update repeat date
        await prisma.repeatData.update({
          where: {
              goal_id: goal.id
          },
          data: {
              last_repeated: today.toISOString()
          }
        }) 
      }
    })
  }
};

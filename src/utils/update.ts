
import { Session } from "next-auth";
import { prisma } from "~/server/db";

export const updateRepeatingGoals = async (session: Session) => {


    const today = new Date();
    const goals = await prisma.repeatData.findMany({
      where: {
        OR: [{
            stop_date: {
                lte: today
            },
            
        }, {
            stop_date: null
        }],

        start_date: {
          gte: today,
        },
        goal: {
          // this is the method to stop a repeating goal
          completed: false
        }
      },
      include: {
        goal: true,
      },
    });

  goals?.forEach(async (goal) => {
    let needs_added;
    const today = new Date();
    const day_map = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const max_date = new Date(8640000000000);
    const stop_date = goal.stop_date ? goal.stop_date : max_date;
    // get type of repeat
    if (goal.type == "Daily") {
      const days = goal.days;
      const day_nums = days.map((day) => day_map[day]);

      // check if it should be repeated today
      if (day_nums.includes(today.getDay())) {
        needs_added = true;
      } else {
        needs_added = false;
      }
    } else if (goal.type == "Weekly") {
      if (goal.last_repeated) {
        const week_later = new Date(
          goal.last_repeated.getTime() + 7 * 24 * 60 * 60 * 1000
        );

        needs_added = today >= week_later && stop_date < week_later;
      } else {
        needs_added = true;
      }
    } else if (goal.type == "Monthly") {
      if (goal.last_repeated) {
        const month_later = new Date(
          goal.last_repeated.setMonth(goal.last_repeated.getMonth() + 1)
        );

        needs_added = today >= month_later && stop_date < month_later;
      } else {
        needs_added = true;
      }
    } else if (goal.type == "Yearly") {
      if (goal.last_repeated) {
        const year_later = new Date(
          goal.last_repeated.setFullYear(goal.last_repeated.getFullYear() + 1)
        );

        needs_added = today >= year_later && stop_date < year_later;
      } else {
        needs_added = true;
      }
    }

    // add new goal if needed, DON'T ADD REPEATING DATA (avoids never ending tasks)

    if (needs_added && session.user) {
      await prisma.goals.create({
        data: {
          user_id: session.user?.id,
          name: goal.goal.name,
          points: goal.goal.points,
          difficulty: goal.goal.difficulty,
          completed: false,
          category: goal.goal.category,
        },
      });
      // update repeat date
      return await prisma.repeatData.update({
        where: {
            goal_id: goal.goal_id
        },
        data: {
            last_repeated: today.toISOString()
        }
      })
    } else {
      return;
    }
  });
};

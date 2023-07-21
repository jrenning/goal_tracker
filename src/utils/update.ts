import { useCallback } from "react";
import { api } from "./api";

export const updateRepeatingGoals = async () => {
  const utils = api.useContext();
  const goals = api.goals.getRepeatingGoals.useQuery().data;

  const add_call = api.goals.addGoal.useMutation({
    async onSuccess(data) {
      await utils.goals.invalidate();
      data && alert(`${data.name} was added!!`);
    },
  });

  const update_call = api.goals.setLastRepeat.useMutation();

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

    if (needs_added) {
      await add_call.mutate ({
        name: goal.goal.name,
        exp: Number(goal.goal.points),
        difficulty: Number(goal.goal.difficulty),
        category: goal.goal.category,
      });
      // update repeat date
      return update_call.mutate({
        id: goal.goal.id,
      });
    } else {
      return;
    }
  });
};

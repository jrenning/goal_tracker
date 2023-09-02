"use client";

import React, { useState } from "react";
import Goal from "./Goal";
import { api } from "~/utils/api";
import usePopup from "~/hooks/usePopup";
import { calculateCoins } from "~/utils/goals";
import { GoalCategories } from "~/pages";

type GoalBoxProps = {
  disabled: boolean;
};

function GoalBox({ disabled }: GoalBoxProps) {
  const [goalCategory, setGoalCategory] = useState<GoalCategories[]>([
    "Physical",
    "Education",
    "Hobby",
    "Career",
    "Social",
  ]);
  const goals = api.goals.getCurrentGoalsByCategory.useQuery({
    category: goalCategory,
  });
  const { setErrorPopup } = usePopup();

  goals.isError && setErrorPopup("Goals could not be fetched");

  const setCategories = (value: GoalCategories | "All") => {
    if (value == "All") {
      setGoalCategory(["Physical", "Education", "Hobby", "Career", "Social"]);
    }
    else {
      setGoalCategory([value])
    }
  }

  return (
    <div>
      <select className="mx-2 select-primary text-xs"
      onChange={(e)=> setCategories(e.target.value as GoalCategories | "All")}>
        <option>All</option>
        <option>Physical</option>
        <option>Education</option>
        <option>Hobby</option>
        <option>Career</option>
        <option>Social</option>
      </select>
      <div className=" flex h-full flex-col items-center justify-center space-y-4 border p-2">
        {goals.data ? (
          goals.data.map((goal, _) => (
            <Goal
              name={goal.name}
              points={Math.floor(goal.points * goal.exp_multiplier)}
              coins={Math.floor(
                calculateCoins(goal.points) * goal.gold_multiplier
              )}
              difficulty={goal.difficulty}
              due_date={goal.due_date}
              category={goal.category}
              id={goal.id}
              key={goal.id}
              disabled={disabled}
              checklist={goal.checklist}
            />
          ))
        ) : (
          <div className="mx-4 h-20 w-full animate-pulse rounded-md bg-slate-200"></div>
        )}
      </div>
    </div>
  );
}

export default GoalBox;

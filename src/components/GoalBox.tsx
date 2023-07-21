"use client";

import React, {  useState } from "react";
import Goal from "./Goal";
import { api } from "~/utils/api";
import GoalForm from "./GoalForm";
import RewardForm from "./RewardForm";

function GoalBox() {
  const goals = api.goals.getCurrentGoals.useQuery();


  const [newGoal, setNewGoal] = useState(false);
  const [newReward, setNewReward] = useState(false);

  return (
    <div>
      <div className=" flex h-full flex-col items-center justify-center space-y-4 border p-2">
        {goals.data
          ? goals.data.map((goal, _) => (
              <Goal
                name={goal.name}
                points={goal.points}
                difficulty={goal.difficulty}
                category={goal.category}
                id={goal.id}
                key={goal.id}
                disabled={false}
              />
            ))
          : ""}
      </div>
      <div className="flex items-center justify-center space-x-8">
        <div className="">
          {!newGoal && !newReward ? (
            <button
              className="rounded-md bg-green-300 px-4 py-[5px] shadow-lg hover:bg-slate-100"
              onClick={() => setNewGoal(true)}
            >
              Add Goal
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center justify-center">
          {!newGoal && !newReward ? (
            <button
              className="rounded-md bg-green-300 px-4 py-[5px] shadow-lg hover:bg-slate-100"
              onClick={() => setNewReward(true)}
            >
              Add Reward
            </button>
          ) : (
            ""
          )}
        </div>
      </div>

      {newGoal ? <GoalForm setNewGoal={setNewGoal} /> : ""}
      {newReward ? <RewardForm setNewReward={setNewReward} /> : ""}
    </div>
  );
}

export default GoalBox;

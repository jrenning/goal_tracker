"use client";

import React, { useState } from "react";
import Goal from "./Goal";
import { api } from "~/utils/api";

type GoalBoxProps = {
  disabled: boolean;
};

function GoalBox({ disabled }: GoalBoxProps) {
  const goals = api.goals.getCurrentGoals.useQuery();

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
                disabled={disabled}
                checklist={goal.checklist}
              />
            ))
          : ""}
      </div>
    </div>
  );
}

export default GoalBox;

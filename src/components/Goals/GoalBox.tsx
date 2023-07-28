"use client";

import React, { useState } from "react";
import Goal from "./Goal";
import { api } from "~/utils/api";
import usePopup from "~/hooks/usePopup";

type GoalBoxProps = {
  disabled: boolean;
};

function GoalBox({ disabled }: GoalBoxProps) {
  const goals = api.goals.getCurrentGoals.useQuery();
  const { setErrorPopup } = usePopup();

  goals.isError && setErrorPopup("Goals could not be fetched");

  return (
    <div>
      <div className=" flex h-full flex-col items-center justify-center space-y-4 border p-2">
        {goals.data ? (
          goals.data.map((goal, _) => (
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
        ) : (
          <div className="h-20 animate-pulse rounded-md bg-slate-200"></div>
        )}
      </div>
    </div>
  );
}

export default GoalBox;

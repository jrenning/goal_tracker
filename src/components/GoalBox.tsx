'use client'

import React from "react";
import Goal from "./Goal";
import Title from "./Title";
import { api } from "~/utils/api";

type Goal = {

}



function GoalBox() {


  const goals = api.goals.getCurrentGoals.useQuery()


  return (
    <div>
      <div className="border h-full m-4 p-2 flex flex-col space-y-4 justify-center items-center">
        {goals.data ? goals.data.map((goal, index) => (
          <Goal
            name={goal.name}
            points={goal.points}
            difficulty={goal.difficulty}
            id={goal.id}
            key={goal.id}
          />
        )) : ""}
      </div>
      <div>
        <Title name="Completed" date={false} />
      </div>
      <div>

      </div>
    </div>
  );
}

export default GoalBox;

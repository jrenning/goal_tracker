"use client";
import React, { useState } from "react";
import { api } from "~/utils/api";

type Props = {
  name: string;
  points: number;
  difficulty: number;
  id: number;
  disabled: boolean;
};

type IdCheck = {
  id: number;
};

function Goal({ name, points, difficulty, id, disabled }: Props) {
  let colors = { 1: "#90EE90", 2: "#FFFFBA", 3: "#FFDFBA", 4: "#FFB3BA" };

  const [color, setColor] = useState(
    difficulty < 4 ? colors[difficulty] : "red"
  );

  const utils = api.useContext();
  const user_query = api.user.getCurrentUserInfo.useQuery();
  const user = user_query.data;
  const level_query = api.levels.getLevel.useQuery({
    level: user ? user.level : 1,
  });

  const complete_call = api.goals.completeGoal.useMutation({
    async onSuccess(data) {
      utils.goals.invalidate();
      data && alert(`${data.name} was completed!!`);
    },
  });

  const add_points_call = api.user.addPoints.useMutation({
    async onSuccess(data) {
      console.log("Points added");
    },
  });

  const level_call = api.user.gainLevel.useMutation({
    async onSuccess(data) {
      utils.user.invalidate();
      utils.levels.invalidate();
      console.log(`The current points are ${user?.current_points}`);
    },
  });

  const completeGoal = async () => {
    await complete_call.mutateAsync({ id: id });
    await add_points_call.mutateAsync({ points: points });

    // check if overflow occured

    if (user) {
      // get new point total
      let current_points = (await user_query.refetch()).data?.current_points;
      let max_points = (await level_query.refetch()).data?.points;

      if (max_points && current_points) {
        while (current_points && max_points && current_points >= max_points) {
          await level_call.mutateAsync({
            overflow: current_points - max_points,
          });
          current_points = (await user_query.refetch()).data?.current_points;
          max_points = (await level_query.refetch()).data?.points;
        }
      }
    }

    setColor("gray");
  };

  return (
    <div
      className="bg-${color}-200 flex h-20 w-full justify-between rounded-md"
      style={{ backgroundColor: `${color}` }}
    >
      <div className="flex w-2/3 flex-row items-center space-x-4 p-4">
        <div className="text-xl font-extrabold">{name}</div>
      </div>
      <div className="flex w-1/3 flex-row items-center justify-evenly">
        <div className="italic">{points} exp</div>
        {!disabled ? (
          <button
            className="rounded-full text-2xl hover:drop-shadow-lg hover:text-green-300 "
            onClick={() => completeGoal()}
          >
            &#x2713;
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Goal;

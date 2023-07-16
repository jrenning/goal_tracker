"use client";
import React, { useContext, useState } from "react";
import { GoalCategories, ModalContext } from "~/pages";
import { api } from "~/utils/api";
import { colors } from "~/utils/colors";
import LevelUp from "./LevelUp";

type Props = {
  name: string;
  points: number;
  difficulty: number;
  id: number;
  disabled: boolean;
  category: GoalCategories;
};

function Goal({ name, points, difficulty, id, disabled, category }: Props) {
  const setModal = useContext(ModalContext);

  type Colors = {
    [key: number]: string;
  };

  const difficulty_colors: Colors = {
    1: "#90EE90",
    2: "#FFFFBA",
    3: "#FFDFBA",
    4: "#FFB3BA",
  };

  const color = colors[category];

  const utils = api.useContext();
  const user_query = api.user.getCurrentUserInfo.useQuery();
  const user = user_query.data;

  const level = api.user.getCategoryLevel.useQuery({ category: category }).data
    ?.level;

    
  const current_points_query = api.user.getCategoryCurrentPoints.useQuery({
    category: category,
  });

  const level_query = api.levels.getLevel.useQuery({
    level: level ? level : 1,
  });

  const reward_query = api.rewards.getLevelRewards.useQuery({
    level: level ? level : 1,
    category: category,
  });

  const complete_call = api.goals.completeGoal.useMutation({
    async onSuccess(data) {
      await utils.goals.invalidate();
      data && alert(`${data ? data.name : "Goal"} was completed!!`);
    },
  });

  const add_points_call = api.user.addPoints.useMutation({
    onSuccess(_) {
      console.log("Points added");
    },
  });

  const level_call = api.user.gainLevel.useMutation({
    async onSuccess(data) {
      await utils.user.invalidate();
      await utils.levels.invalidate();
    },
  });

  const getCurrentPoints = async () => {
    const current_points = (await current_points_query.refetch()).data
      ?.current_points;
    return current_points;
  };

  const completeGoal = async () => {
    await complete_call.mutateAsync({ id: id });
    await add_points_call.mutateAsync({ points: points, category: category });

    if (user) {
      // get new point total
      let current_points = await getCurrentPoints();
      let max_points = (await level_query.refetch()).data?.points;

      if (max_points && current_points) {
        while (current_points && max_points && current_points >= max_points) {
          await level_call.mutateAsync({
            category: category,
            overflow: current_points - max_points,
          });
          current_points = await getCurrentPoints();
          max_points = (await level_query.refetch()).data?.points;
        }

        // refetch to get level
        const level = (await level_query.refetch()).data?.number;
        const data = (await reward_query.refetch()).data;
        const rewards = data?.rewards;
        const categories = data?.reward_category;
        setModal &&
          setModal({
            title: "Congrats, you leveled up!",
            content: (
              <LevelUp
                level={level ? level : 0}
                rewards={rewards ? rewards : []}
                categories={categories ? categories : []}
              />
            ),
            isOpen: true,
            backgroundColor: color ? color : "#fffff",
          });
      }
    }
  };

  return (
    <div
      className="bg-${color}-200 flex h-20 w-full justify-between rounded-md"
      style={{ backgroundColor: `${color ? color : "white"}` }}
    >
      <div className="flex w-2/3 flex-row items-center space-x-4 p-4">
        <div className="text-xl font-extrabold">{name}</div>
      </div>
      <div className="flex w-1/3 flex-row items-center justify-evenly">
        <div className="italic">{points} exp</div>
        {!disabled ? (
          <button
            className="rounded-full text-2xl hover:text-green-300 hover:drop-shadow-lg "
            onClick={() => {
              completeGoal();
            }}
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

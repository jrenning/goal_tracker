"use client";
import React, { useContext, useState } from "react";
import { GoalCategories, ModalContext } from "~/pages";
import { api } from "~/utils/api";
import { colors } from "~/utils/colors";
import LevelUp from "../Modals/LevelUp";
import { isRouteMatch } from "next/dist/server/future/route-matches/route-match";

type Checklist = {
  id: number;
  goal_id: number;
  name: string;
  completed: boolean;
  date_completed: Date | null;
};

type Props = {
  name: string;
  points: number;
  difficulty: number;
  id: number;
  disabled: boolean;
  category: GoalCategories;
  checklist?: Checklist[];
};

function Goal({
  name,
  points,
  difficulty,
  id,
  disabled,
  category,
  checklist,
}: Props) {
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

  const [checklistOpen, setChecklistOpen] = useState(false);

  const color = colors[category];

  const utils = api.useContext();
  const user_query = api.user.getCurrentUserInfo.useQuery();
  const user = user_query.data;

  const user_level_query = api.user.getCategoryLevel.useQuery({
    category: category,
  });

  const level = user_level_query.data?.level;

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

  const complete_checklist_call =
    api.goals.completeGoalChecklistItem.useMutation({
      async onSuccess(_) {
        await utils.goals.invalidate();
      },
    });

  const add_points_call = api.user.addPoints.useMutation({
    async onSuccess(data) {
      await utils.goals.invalidate();
      await utils.user.invalidate();
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
      let level_up = false;
      if (max_points && current_points) {
        while (current_points && max_points && current_points >= max_points) {
          level_up = true;
          const level = await level_call.mutateAsync({
            category: category,
            overflow: current_points - max_points,
          });
          current_points = current_points - max_points;
          max_points = (await level_query.refetch()).data?.points;
        }
        if (level_up) {
          // refetch to get level
          const level = (await user_level_query.refetch()).data?.level;
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
    }
  };

  const completeChecklistItem = async (id: number) => {
    await complete_checklist_call.mutateAsync({
      id: id,
    });
  };
  return (
    <div
      className="bg-${color}-200 flex w-full flex-col justify-between rounded-md"
      style={{ backgroundColor: `${color ? color : "white"}` }}
    >
      <div className="flex w-full flex-row items-center space-x-2 px-4">
        <div className="w-[65%] text-xl font-extrabold">{name}</div>

        <div className="w-[25%] italic ">{points} exp</div>
        {!disabled ? (
          <button
            className="w-[10%] rounded-full text-2xl hover:text-green-300 hover:drop-shadow-lg "
            onClick={() => {
              completeGoal();
            }}
          >
            &#x2714;
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="flex w-full">
        <div className="w-[90%]"></div>
        {checklist && checklist.length > 0 ? (
          <>
            <div className="px-1">
              {checklist?.filter((item) => item.completed == true).length}/
              {checklist?.length}
            </div>
            <button
              className="ml-auto rotate-90 px-2 font-semibold"
              onClick={() => setChecklistOpen(!checklistOpen)}
            >
              &#x276F;
            </button>
          </>
        ) : (
          ""
        )}
      </div>
      {checklistOpen ? (
        <>
          <div className="mb-auto h-[1px] w-full bg-black"></div>
          <div className="flex flex-col space-y-4">
            {checklist
              ? checklist
                  .map((item) => {
                    return {
                      name: item.name,
                      completed: item.completed,
                      id: item.id,
                    };
                  })
                  .map((item) => (
                    <div className="flex flex-row items-center justify-between">
                      <div
                        className="px-4 text-xl font-bold"
                        style={{
                          textDecoration: item.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {item.name}
                      </div>
                      {!item.completed ? (
                        <button
                          className="bg-transparent px-6"
                          onClick={() => completeChecklistItem(item.id)}
                          disabled={item.completed}
                        >
                          &#x2714;
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ))
              : ""}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Goal;

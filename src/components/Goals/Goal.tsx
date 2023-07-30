"use client";
import React, { useContext, useState } from "react";
import { GoalCategories } from "~/pages";
import { api } from "~/utils/api";
import { colors } from "~/utils/colors";
import LevelUp from "../Modals/LevelUp";
import { ModalContext } from "~/pages/_app";
import ChecklistView from "./ChecklistView";
import useDataActions from "~/hooks/useDataActions";
import usePopup from "~/hooks/usePopup";
import Swipeable from "../UI/Swipeable";

export type Checklist = {
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

  const [checklistOpen, setChecklistOpen] = useState(false);
  const [deleteSection, setDeleteSection] = useState(false)

  const color = colors[category];

    const { completeGoal, addPoints, gainLevel, createLevel, deleteGoal } =
      useDataActions();

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




  const completeGoalAction = async () => {

    // create level if one doesn't exist
    if (level_query.isError) {
      await createLevel.mutateAsync({level: level ? level+1 : 1}) 
    }


    await completeGoal.mutateAsync({ id: id });
    await addPoints.mutateAsync({ points: points, category: category });

    // get new point total
    let current_points = (await current_points_query.refetch()).data
      ?.current_points;
    let max_points = (await level_query.refetch()).data?.points;
    let level_up = false;
    if (max_points && current_points) {
      while (max_points && (current_points >= max_points)) {
        level_up = true;
        const level = await gainLevel.mutateAsync({
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
  };


  return (
    <Swipeable onSwipe={()=> setDeleteSection(true)} onSwipeBack={()=> setDeleteSection(false)} direction="Left">
      <div className="flex flex-row">
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
                  completeGoalAction();
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
          {checklistOpen ? <ChecklistView checklist={checklist} /> : ""}
        </div>
        <div className="h-inherit w-8 bg-red-300 justify-center items-center" onClick={async()=> await deleteGoal.mutateAsync({
          goal_id: id
        })} style={{display: deleteSection ? "flex" : "none"}}>&#x2613;</div>
      </div>
    </Swipeable>
  );
}

export default Goal;

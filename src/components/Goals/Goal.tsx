
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
import useModal from "~/hooks/useModal";
import { useRouter } from "next/router";
import Pill from "./Pill";

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
  due_date: Date | null
  id: number;
  disabled: boolean;
  category: GoalCategories;
  checklist?: Checklist[];
};

function Goal({
  name,
  points,
  difficulty,
  due_date,
  id,
  disabled,
  category,
  checklist,
}: Props) {
  const setModal = useContext(ModalContext);
  const router = useRouter()

  const [checklistOpen, setChecklistOpen] = useState(false);
  const [deleteSection, setDeleteSection] = useState(false)

  const color = colors[category];

    const { completeGoal, addPoints, gainLevel, createLevel, deleteGoal } =
      useDataActions();


      const {levelUpModal, goalModal} =  useModal()

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
        levelUpModal({
          level: level ? level : 1,
          rewards: rewards,
          categories: categories,
          goal_category: category
        })
      }
    }
  };



  return (
    <Swipeable
      onSwipe={() => setDeleteSection(true)}
      onSwipeBack={() => setDeleteSection(false)}
      direction="Left"
    >
      <div className="relative flex h-full w-full flex-row">
        <div
          className=" flex h-full w-full flex-col justify-between rounded-md py-4 shadow-md border border-black"
          onDoubleClick={() => router.push(`/goal/${id}`)}
          style={{ background: `radial-gradient(#ffffff, ${color})` }}
        >
          <div className="flex w-full flex-row items-center space-x-2 px-4">
            <div className="w-[90%] text-xl font-extrabold">{name}</div>

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
          <div className="mx-4 my-2 flex flex-row space-x-4">
            <Pill name={`${points} exp`} backgroundColor="orange" />
            {due_date && <Pill name={`${due_date.toDateString()}`} backgroundColor="#e0d6ff"/>}
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
        <div
          className="absolute right-0 h-full w-12 items-center justify-center bg-red-300 font-semibold transition delay-100 ease-in-out dark:text-white"
          onClick={async () =>
            await deleteGoal.mutateAsync({
              goal_id: id,
            })
          }
          style={{ display: deleteSection ? "flex" : "none" }}
        >
          &#x2613;
        </div>
      </div>
    </Swipeable>
  );
}

export default Goal;

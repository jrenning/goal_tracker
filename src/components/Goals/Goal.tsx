import React, { useContext, useState } from "react";
import { GoalCategories } from "~/pages";
import { api } from "~/utils/api";
import { colors } from "~/utils/colors";
import ChecklistView from "./ChecklistView";
import useDataActions from "~/hooks/useDataActions";
import Swipeable from "../UI/Swipeable";
import useModal from "~/hooks/useModal";
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
  coins?: number;
  difficulty: number;
  due_date: Date | null;
  id: number;
  disabled: boolean;
  category: GoalCategories;
  checklist?: Checklist[];
};

function Goal({
  name,
  points,
  coins,
  difficulty,
  due_date,
  id,
  disabled,
  category,
  checklist,
}: Props) {
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [deleteSection, setDeleteSection] = useState(false);

  const color = colors[category];

  const { completeGoal, gainLevel, createLevel, deleteGoal } = useDataActions();

  const { levelUpModal, goalModal } = useModal();

  const reward_query = api.rewards.getLevelRewards.useMutation();

  const completeGoalAction = async () => {
    // create level if one doesn't exist
    // if (level_query.isError) {
    //   await createLevel.mutateAsync({ level: level ? level + 1 : 1 });
    // }

    await completeGoal.mutateAsync({ id: id });

    const { level_up, new_level } = await gainLevel.mutateAsync({
      category: category,
    });

    if (level_up && new_level) {
      const data = await reward_query.mutateAsync({
        category: category,
        level: new_level.level,
      });
      levelUpModal({
        level: new_level.level,
        rewards: data?.rewards,
        categories: data?.reward_category,
        goal_category: data?.category,
      });
    }
  };

  const openGoalModal = () => {
    console.log(id);
    goalModal({
      id: id,
      category: category,
      name: name,
    });
  };

  return (
    <Swipeable
      onSwipe={() => setDeleteSection(true)}
      onSwipeBack={() => setDeleteSection(false)}
      direction="Left"
    >
      <div className="relative flex h-full w-full flex-row">
        <div
          className=" flex h-full w-full flex-col justify-between rounded-md border border-black py-4 shadow-md"
          onDoubleClick={() => openGoalModal()}
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
            <Pill backgroundColor="orange">{points} exp</Pill>
            <Pill backgroundColor="#d7cd59">{coins} &#x274D;</Pill>
            {due_date && (
              <Pill backgroundColor="#e0d6ff">{due_date.toDateString()}</Pill>
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

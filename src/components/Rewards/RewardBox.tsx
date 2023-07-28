import React, { useState } from "react";
import { GoalCategories, RewardCategories } from "~/pages";
import { api } from "~/utils/api";
import { colors } from "~/utils/colors";
import TimeRangeSelector from "../UI/TimeRangeSelector";

function RewardBox() {
  const [dateSearch, setDateSearch] = useState<Date>();

  const [runQuery, setRunQuery] = useState<boolean>(false);

  const today = new Date();

  const rewards = api.rewards.getFinishedRewards.useQuery(
    {
      date: dateSearch ? dateSearch : today,
    },
    { enabled: runQuery }
  ).data;

  return (
    <div className="mt-8">
      <TimeRangeSelector
        setDateSearch={setDateSearch}
        setRunQuery={setRunQuery}
      />
      <div className="flex flex-col space-y-4">
        {rewards?.map((reward) =>
          reward.rewards.map((idv_reward, index) => (
            //@ts-ignore
            <Reward
              name={idv_reward}
              reward_category={reward.reward_category[index]}
              goal_category={reward.category}
              level={reward.level}
              achieved_at={reward.achieved_at}
            />
          ))
        )}
      </div>
    </div>
  );
}

type RewardProps = {
  name: string;
  reward_category: RewardCategories | undefined;
  goal_category: GoalCategories;
  level: number;
  achieved_at: Date | null;
};

function Reward({
  name,
  goal_category,
  reward_category,
  level,
  achieved_at,
}: RewardProps) {
  const color = colors[goal_category];
  return (
    <div
      className="mx-4 rounded-md p-1"
      style={{ backgroundColor: color ? color : "white" }}
    >
      <div className="flex flex-row justify-evenly">
        <div className="text-2xl">
          <h2>{name}</h2>
        </div>
        <div className="absolute right-6 flex h-12 w-12 items-center justify-center rounded-full border border-black bg-blue-400 px-2 py-[0.2rem] text-3xl font-semibold text-white">
          {level}
        </div>
      </div>
      <div className="text-lg font-semibold">{achieved_at ? achieved_at.toDateString() : ""}</div>
    </div>
  );
}

export default RewardBox;

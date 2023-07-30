import React from "react";
import Reward from "./RewardModal";

export type LevelUpProps = {
  level: number;
  rewards?: string[];
  categories?: string[];
};

function LevelUp({ level, rewards, categories }: LevelUpProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-black bg-blue-400 px-2 py-[0.2rem] text-6xl font-semibold text-white">
        {level}
      </div>
      <div className="mt-8 text-3xl font-bold">Rewards</div>
      <div className="mt-8 grid h-full w-[85%] grid-cols-3 space-x-2">
        {rewards
          ? rewards.map((reward, index) => (
              <Reward
                name={reward}
                //@ts-ignore
                category={categories[index] ? categories[index] : "outdoors"}
              />
            ))
          : ""}
      </div>
    </div>
  );
}

export default LevelUp;

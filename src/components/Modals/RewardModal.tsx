import React from "react";
import { GoalCategories, Rarities } from "~/pages";
import { api } from "~/utils/api";
import { ExpIcon } from "../Rewards/RewardTooltip";
import { colors } from "~/utils/colors";
import Link from "next/link";
import useModal from "~/hooks/useModal";
import { useRouter } from "next/router";

export type RewardModalProps = {
  category: GoalCategories;
};

function RewardModal({ category }: RewardModalProps) {
  const max_level = api.levels.getMaxLevel.useQuery().data?._max.number;



  const levels = [];
  if (max_level) {
    for (let i = 1; i <= max_level; i++) {
      levels.push(i);
    }
  }

  return (
    <div className="mx-4 mt-4 grid h-[325px] grid-cols-1 items-center justify-center gap-4 overflow-y-auto">
      {levels.map((number) => (
        <LevelRewards key={number} level={number} category={category}/>
      ))}
    </div>
  );
}

type LevelRewardProps = {
  level: number;
  category: GoalCategories
};

const Card = <svg viewBox="0 0 384 512"><path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z"/></svg>

function LevelRewards({ level, category }: LevelRewardProps) {
  const reward_data = api.levels.getLevel.useQuery({ level: level }).data;
  const specific_reward_data = api.rewards.getLevelRewardsQ.useQuery({level: level, category: category}).data

    const { closeModal } = useModal();
    const router = useRouter();

  return (
    <div className="flex flex-row space-x-4 rounded-md bg-slate-100 p-4">
      <div className="text-3xl font-bold">{level}</div>
      <div className="flex flex-row items-center space-x-2 font-semibold">
        <div>{reward_data?.points}</div>
        <div className="h-5 w-5 fill-blue-300 ">{ExpIcon}</div>
      </div>
      <div className="flex flex-row items-center space-x-2 font-semibold">
        <div>{reward_data?.coins}</div>
        <div className="text-lg font-bold  text-yellow-300">&#x274D;</div>
      </div>
      <CardIcon number={specific_reward_data?.common_cards} type="Common" />
      <CardIcon number={specific_reward_data?.rare_cards} type="Rare" />
      <CardIcon number={specific_reward_data?.epic_cards} type="Epic" />
      <CardIcon
        number={specific_reward_data?.legendary_cards}
        type="Legendary"
      />
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300 shadow-lg"
          onClick={() => {
            router.push(`/add_reward/${level}-${category}`)
            closeModal()
          }}
        >
          +
        </button>
    </div>
  );
}

type CardIconProps = {
    number: number | undefined
    type: Rarities
}

function CardIcon({number, type}: CardIconProps) {

    return (
      <>
        {number && number > 0 ? (
          <div className="">
            <div style={{ fill: colors[type] }}>{Card}</div>
            <div>x {number}</div>
          </div>
        ) : (
          ""
        )}
      </>
    );
}

export default RewardModal;

import React from 'react'
import Tooltip from '../UI/Tooltip';
import { GoalCategories } from '~/pages';
import { api } from '~/utils/api';


type RewardTooltipProps = {
    rewardOpen: boolean
    category: GoalCategories
    level: number
}

export const ExpIcon = <svg viewBox="0 0 512 512"><path d="M211 7.3C205 1 196-1.4 187.6 .8s-14.9 8.9-17.1 17.3L154.7 80.6l-62-17.5c-8.4-2.4-17.4 0-23.5 6.1s-8.5 15.1-6.1 23.5l17.5 62L18.1 170.6c-8.4 2.1-15 8.7-17.3 17.1S1 205 7.3 211l46.2 45L7.3 301C1 307-1.4 316 .8 324.4s8.9 14.9 17.3 17.1l62.5 15.8-17.5 62c-2.4 8.4 0 17.4 6.1 23.5s15.1 8.5 23.5 6.1l62-17.5 15.8 62.5c2.1 8.4 8.7 15 17.1 17.3s17.3-.2 23.4-6.4l45-46.2 45 46.2c6.1 6.2 15 8.7 23.4 6.4s14.9-8.9 17.1-17.3l15.8-62.5 62 17.5c8.4 2.4 17.4 0 23.5-6.1s8.5-15.1 6.1-23.5l-17.5-62 62.5-15.8c8.4-2.1 15-8.7 17.3-17.1s-.2-17.3-6.4-23.4l-46.2-45 46.2-45c6.2-6.1 8.7-15 6.4-23.4s-8.9-14.9-17.3-17.1l-62.5-15.8 17.5-62c2.4-8.4 0-17.4-6.1-23.5s-15.1-8.5-23.5-6.1l-62 17.5L341.4 18.1c-2.1-8.4-8.7-15-17.1-17.3S307 1 301 7.3L256 53.5 211 7.3z"/></svg>

function RewardTooltip({rewardOpen, category, level}: RewardTooltipProps) {
const get_rewards = api.levels.getLevel.useQuery({
    level: level
}).data
const get_specific_rewards = api.rewards.getLevelRewardsQ.useQuery({
    level: level,
    category: category
}).data
let extra_rewards = 0
if (get_specific_rewards) {
    extra_rewards += get_specific_rewards.common_cards + get_specific_rewards.rare_cards + get_specific_rewards.epic_cards + get_specific_rewards.legendary_cards
}
  return (
    <Tooltip
      content={
        <div className='w-full'>
          <div className="text-xs font-semibold">Next rewards: </div>
          <div className="flex w-full flex-row items-center space-x-2 font-semibold">
            <div>{get_rewards?.points}</div>
            <div className="h-5 w-5 fill-blue-300 ">{ExpIcon}</div>
          </div>
          <div className="flex flex-row items-center space-x-2 font-semibold">
            <div>{get_rewards?.coins}</div>
            <div className="text-lg font-bold  text-yellow-300">&#x274D;</div>
          </div>
          {extra_rewards > 0 ? (
            <div className="text-sm">{extra_rewards} others</div>
          ) : (
            ""
          )}
        </div>
      }
      isOpen={rewardOpen}
      backgroundColor="#eeeeee"
      selector={`#reward_tooltip_${category}`}
    />
  );
}

export default RewardTooltip
import React, { useState } from 'react'
import { GoalCategories } from '~/pages';
import { api } from '~/utils/api';
import { colors } from '~/utils/colors';
import Tooltip from '../UI/Tooltip';
import RewardTooltip from '../Rewards/RewardTooltip';
import useModal from '~/hooks/useModal';

type ProgressProps = {
  level: number,
  points: number
  category: GoalCategories
}



function ProgressBar({level, points, category}: ProgressProps) {

const topProgress = points

const levelQuery = api.levels.getLevel.useQuery({level: level}).data?.points

const bottomProgress = levelQuery ? levelQuery : 10

const color = colors[category]

const [rewardOpen, setRewardOpen] = useState(false)

const {rewardModal} = useModal()

const user_level = api.user.getCategoryLevel.useQuery({
  category: category
}).data?.level







  return (
    <div>
      <div className="relative flex w-full flex-row justify-center  space-x-3 p-4">
        <div
          className="w-10  rounded-full bg-black text-center   font-semibold text-black"
          style={{ backgroundColor: color ? color : "" }}
          onMouseEnter={()=> setRewardOpen(true)}
          onMouseLeave={()=> setRewardOpen(false)}
          onDoubleClick={()=> rewardModal({category: category})}
        >
          {level}
        </div>
        <div className=" flex h-6 w-2/3 items-center rounded-md bg-gray-300 text-[0.7rem] md:text-lg">
          <div className="absolute mx-2 font-mono font-semibold text-black">
            {category}
          </div>
          <div
            className="h-6 rounded-md bg-blue-300"
            style={{
              width: `calc(100%*${topProgress / bottomProgress}`,
              backgroundColor: color ? color : "",
            }}
          ></div>
        </div>

        <div className="font-semibold dark:text-white">
          {topProgress}/{bottomProgress}
        </div>
      </div>
      <div id={`reward_tooltip_${category}`}></div>
      <RewardTooltip rewardOpen={rewardOpen} category={category} level={user_level ? user_level : 0} />
    </div>
  );
}

export default ProgressBar
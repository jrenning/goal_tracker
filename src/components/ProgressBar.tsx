import React from 'react'
import { GoalCategories } from '~/pages';
import { api } from '~/utils/api';
import { colors } from '~/utils/colors';

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


  return (
    <div className="flex w-full flex-row justify-center  space-x-3 p-4">
      <div className="w-10  rounded-full bg-black text-center   font-semibold text-white">
        {level}
      </div>
      <div className=" flex h-6 w-2/3 items-center rounded-md bg-gray-300 text-[0.9rem] md:text-lg">
        <div className="absolute mx-2 font-mono font-semibold text-slate-50">
          {category}
        </div>
        <div
          className="h-6 rounded-md bg-blue-300"
          style={{
            width: `calc(100%*${topProgress / bottomProgress}`,
            backgroundColor: color ? color : "#bbbbb"
          }}
        ></div>
      </div>

      <div className="font-semibold">
        {topProgress}/{bottomProgress}
      </div>
    </div>
  );
}

export default ProgressBar
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
    <div className="p-4 w-full justify-center flex  space-x-3 flex-row">
      <div className='rounded-full  w-10 text-center text-white font-semibold bg-black'>{level}</div>
      <div className=" flex w-2/3 items-center bg-gray-300 h-6 rounded-md">
        <div className='absolute mx-2 font-semibold text-slate-50 font-mono'>{category}</div>
        <div
          className="h-6 rounded-md bg-blue-300"
          style={{ width: `calc(100%*${topProgress / bottomProgress}`, backgroundColor: color ? color : "#bbbbb"}}
        ></div>
      </div>

      <div className='font-semibold'>
        {topProgress}/{bottomProgress}
      </div>
    </div>
  );
}

export default ProgressBar
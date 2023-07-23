import React from 'react'
import { api } from '~/utils/api';
import ProgressBar from './ProgressBar';
import { GoalCategories } from '~/pages';

function ProgressBox() {



const user_stats = api.user.getUserStats.useQuery().data

let levels: number[] = [];
let points: number[] = [];
let categories: GoalCategories[] = []

if (user_stats) {
    user_stats.stats.forEach((stat) => {
      levels.push(stat.level);
      points.push(stat.current_points);
      categories.push(stat.category)
    });
}


  return (
    <div className='grid grid-cols-2 items-center justify-center'>
    {points && points.map((point, index)=> (
        //@ts-ignore
        <ProgressBar key={index} level={levels[index] ? levels[index] : 1} points={point ? point : 0} category={categories[index]}/>
    ))}
    </div>
  )
}

export default ProgressBox
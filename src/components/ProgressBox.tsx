import React from 'react'
import { api } from '~/utils/api';
import ProgressBar from './ProgressBar';
import { GoalCategories } from '~/pages';

function ProgressBox() {

const user = api.user.getCurrentUserInfo.useQuery().data;


const levels = [user?.level_education, user?.level_hobby, user?.total_points_odd_job, user?.level_physical, user?.level_social]
const points = [user?.current_points_education, user?.current_points_hobby, user?.current_points_odd_job, user?.current_points_physical, user?.current_points_social]
const categories: GoalCategories[] = ["Education", "Hobby", "Odd_Job", "Physical", "Social"]

  return (
    <div className='grid grid-cols-2 items-center justify-center'>
    {points && points.map((point, index)=> (
        //@ts-ignore
        <ProgressBar level={levels[index] ? levels[index] : 1} points={point ? point : 0} category={categories[index]}/>
    ))}
    </div>
  )
}

export default ProgressBox
import React from 'react'
import { api } from '~/utils/api';


function ProgressBar() {

const user = api.user.getCurrentUserInfo.useQuery().data;


//const [topProgress, bottomProgress] = [5, 10]
const level = user ? user.level : 1
const topProgress = user ? user.current_points : 0

const levelQuery = api.levels.getLevel.useQuery({level: level}).data?.points

const bottomProgress = levelQuery ? levelQuery : 10

  return (
    <div className="p-4 w-screen justify-center flex  space-x-3 flex-row">
      <div className='rounded-full bg-black w-10 text-center text-white font-semibold'>{level}</div>
      <div className=" flex w-2/3 items-center bg-gray-300 h-6 rounded-md">
        <div
          className="bg-blue-300 h-6 rounded-md"
          style={{ width: `calc(100%*${topProgress / bottomProgress}` }}
        ></div>
      </div>

      <div className='font-semibold'>
        {topProgress}/{bottomProgress}
      </div>
    </div>
  );
}

export default ProgressBar
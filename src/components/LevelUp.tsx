import React from 'react'
import Reward from './Reward'

type LevelProps = {
    level: number,
    rewards?: string[]
}

function LevelUp({level, rewards}: LevelProps) {
  return (
    <div className='flex flex-col items-center justify-center mt-8'>
        <div className='h-20 w-20 text-6xl font-semibold bg-blue-400 text-white flex items-center justify-center rounded-full py-[0.2rem] px-2 border border-black'>
            {level}
        </div>
        <div className='mt-8 text-3xl font-bold'>Rewards</div>
        <div className='grid mt-8 grid-cols-3 w-[85%] space-x-2 h-full'>
            {rewards ? rewards.map((reward, index)=> (
                <Reward name={reward} category="outdoors"/>
            )) : ""}

        </div>
    </div>
  )
}

export default LevelUp
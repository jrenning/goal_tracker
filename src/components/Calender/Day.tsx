import { useRouter } from 'next/router'
import React from 'react'

type DayProps = {
    day: number,
    month: number,
    year: number,
    goal_number: number
}

function Day({day,month, year, goal_number}: DayProps) {
    const router = useRouter ()

    const openDay = () => {
        router.push(`/repeats/${day}-${month}-${year}`)
    }

  return (
    <div className="h-full relative w-full border border-gray-100 p-4 text-xl" onClick={()=> openDay()}>
        <div className='text-sm  absolute  top-0 bg-red-300 rounded-full px-1 right-0'>{goal_number}</div>
      <h2>{day}</h2>
    </div>
  );
}

export default Day
import React from 'react'
import Day from './Day'

function Calender() {
    const weeks: WeekAbv[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  return (
    <div className="mt-12">
      <div className='p-4 bg-slate-200'>
        <h1 className='text-2xl font-semibold'>July 2023</h1>
      </div>
      <div className="grid grid-cols-7 grid-rows-6">
        {weeks.map((week)=> (
            <WeekDay letter={week} key={week}/>
        ))}
        {days.map((day) => (
          <Day day={day} goal_number={1} month={6} year={2022} />
        ))}
      </div>
      <div className='flex flex-row mt-2 justify-evenly items-center'>
            <button className='select-primary bg-green-300 hover:bg-gray-50'>Previous</button>
            <button className='select-primary bg-green-300 hover:bg-gray-50'>Next</button>
      </div>
      <div className='flex flex-row mx-8 justify-evenly items-center'>
            <div className='font-semibold text-xl'>Jump To</div>
            <select className='select-primary'>
                <option>June</option>
            </select>
            <select className='select-primary'>
                <option>2022</option>
            </select>
      </div>
    </div>
  );
}

type WeekAbv = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"

type WeekProps = {
    letter: WeekAbv
}

function WeekDay ({letter}: WeekProps) {
    return (
    <div className='w-full h-full bg-slate-100 flex justify-center items-center font-semibold'>{letter}</div>
    )
}

export default Calender
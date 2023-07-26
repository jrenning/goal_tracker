import React, { useEffect, useState } from 'react'
import Day from './Day'
import { api } from '~/utils/api'
import { Goals, RepeatData } from '@prisma/client'
import { convertToUTC } from '~/utils/datetime'

    export const weeks: WeekAbv[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    export const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    export const month_map = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    }

function Calender() {


    const [date, setDate] = useState(new Date())


    const {data, refetch} = api.goals.getRepeatGoalsInMonth.useQuery({
        date: convertToUTC(new Date(date.getFullYear(), date.getMonth()+1, 0))
    })
    const goals_in_month = data

    const filler_goal: RepeatData[] = []

    const getCalenderInfo = (month: number, year: number) => {
        let firstDay = (new Date(year, month)).getDay()

        let totalDays = 32 - new Date(year, month, 32).getDate()

        return [firstDay, totalDays]

    }

    useEffect(()=> {
        refetch()
    }, [date])

    const constructDayArray = (firstDay: number, totalDays: number) => {
        let days = new Array(firstDay).fill("")
        let added = [];

        for (let i=1; i<=totalDays; i++) {
            added.push(i)
        }

        days = days.concat(added)

        return days

    }

    const setCalender = (previous: boolean) => {
        let add = previous ? -1 : 1
        setDate(prevDate => {
            return new Date(prevDate.getFullYear(), prevDate.getMonth()+add)
        })
    }

    const [firstDay, totalDays] = getCalenderInfo(date.getMonth(), date.getFullYear())

    const days = constructDayArray(firstDay ? firstDay : 0, totalDays ? totalDays : 0)
  return (
    <div className="">
      <div className="bg-slate-200 p-4 dark:bg-slate-300">
        <h1 className="text-2xl font-semibold ">
          {months[date.getMonth()]} {date.getFullYear()}
        </h1>
      </div>
      <div className="grid grid-cols-7 grid-rows-6 ">
        {weeks.map((week) => (
          <WeekDay letter={week} key={week} />
        ))}
        {days.map((day, index) => (
          <Day
            day={day}
            key={day + index}
            month={date.getMonth()}
            year={date.getFullYear()}
            goal_data={goals_in_month ? goals_in_month : filler_goal}
          />
        ))}
      </div>
      <div className="flex flex-row items-center  justify-evenly space-x-8">
        <button
          className="select-primary bg-green-300 hover:bg-gray-50"
          onClick={() => setCalender(true)}
        >
          Previous
        </button>
        <button
          className="select-primary bg-green-300 hover:bg-gray-50"
          onClick={() => setCalender(false)}
        >
          Next
        </button>
      </div>
      <div className=" mt-8 flex  flex-row items-center justify-evenly">
        <div className="text-xl font-semibold dark:text-white">Jump To</div>
        <select
          className="select-primary"
          onChange={(e) => {
            const target = e.target as typeof e.target & {
              value: number;
            };
            setDate(new Date(date.getFullYear(), month_map[target.value]));
          }}
        >
          {months.map((month) => (
            <option>{month}</option>
          ))}
        </select>
        <select className="select-primary">
          <option>2023</option>
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
    <div className='w-full h-full bg-slate-100 flex justify-center items-center font-semibold dark:bg-slate-200'>{letter}</div>
    )
}

export default Calender
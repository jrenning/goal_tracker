import Link from 'next/link';
import { useRouter } from 'next/router'
import React from 'react'
import { months, weeks } from '~/components/Calender/Calender';
import Goal from '~/components/Goal';
import PopupTransitionLayout from '~/components/PopupTransitionLayout';
import { api } from '~/utils/api';
import { convertToUTC } from '~/utils/datetime';

function DatePopup() {
  const router = useRouter()
  //@ts-ignore
  const router_date: string = router.query.date ? router.query.date : "1/1/1900"
  const date = convertToUTC(new Date(router_date ? router_date : "1/1/1900"))


  const goals = api.goals.getRepeatingGoalsByDate.useQuery({
    date: date
  })


  return (
    <PopupTransitionLayout>
      <div>
        <Link href={"/repeats"}>
          <button className="m-2 rounded-full bg-slate-200 px-2 py-1 text-xl shadow-md">
            &#x2190;
          </button>
        </Link>
        <div>
          <h1 className="flex items-center justify-center text-2xl">
            {weeks[date.getDay()]} {months[date.getMonth()]} {date.getDate()}
          </h1>
        </div>
        <div className=" flex h-full flex-col items-center justify-center space-y-4 border p-2">
          {goals.data
            ? goals.data.map((goal, _) => (
                <Goal
                  name={goal.name}
                  points={goal.points}
                  difficulty={goal.difficulty}
                  category={goal.category}
                  id={goal.id}
                  key={goal.id}
                  disabled={true}
                />
              ))
            : ""}
        </div>
      </div>
    </PopupTransitionLayout>
  );
}

export default DatePopup
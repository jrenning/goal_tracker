import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { months, weeks } from "~/components/Calender/Calender";
import Goal from "~/components/Goals/Goal";
import PopupTransitionLayout from "~/components/Transitions/PopupTransitionLayout";
import { api } from "~/utils/api";
import { convertToUTC } from "~/utils/datetime";

function getDateNumbers(date_string: string) {
  const sections = date_string.split("-");

  if (sections.length < 3) {
    throw new Error("Date was passed incorrectly");
  }
  return {
    year: Number(sections[0]),
    month: Number(sections[1]),
    day: Number(sections[2]),
  };
}

function DatePopup() {
  const router = useRouter();
  //@ts-ignore
  const router_date: string = (router.query.date as string)
    ? router.query.date
    : "1-1-1900";

  // convert string to number to help support browsers that can't do the string constructor of Date
  const { year, month, day } = getDateNumbers(
    router_date ? router_date : "1900-1-1"
  );

  const date = convertToUTC(new Date(year, month, day));

  const goals = api.goals.getRepeatingGoalsByDate.useQuery({
    date: date,
  });

  return (
    <PopupTransitionLayout keyName="date-popup">
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
                  due_date={goal.due_date}
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

export default DatePopup;


import { useRouter } from "next/router";
import React, { useContext } from "react";
import { ThemeContext } from "~/utils/theme";
import { useLoaded } from "../../hooks/useLoaded";
import { filterGoalsInRange } from "~/utils/goals";

type DayProps = {
  day: number;
  month: number;
  year: number;
  goal_data: any[];
  due_date_data: any[]
};


function Day({ day, month, year, goal_data, due_date_data }: DayProps) {
  const router = useRouter();
  const date = new Date(year, month, day);
  const today = new Date();
  const due_dates = due_date_data.filter((due_date)=> due_date.due_date.toDateString() == date.toDateString())
  const goal_number = filterGoalsInRange(goal_data, date, date).length + due_dates.length

  const openDay = () => {
    router.push(`/repeats/${year}-${month + 1}-${day}`);
  };

  const { theme, setTheme } = useContext(ThemeContext);
  const loaded = useLoaded();

  const getBackgroundColor = () => {
    if (loaded) {
      if (today.toDateString() == date.toDateString()) {
        if (theme == "light") {
          return "yellow";
        } else {
          return "orange";
        }
      } else {
        if (theme == "light") {
          return "white";
        } else {
          return "#121212";
        }
      }
    }
  };

  return (
    <div
      className="relative h-full w-full border border-gray-100 p-4 text-xl dark:border-gray-300 dark:bg-black dark:text-white"
      onClick={() => openDay()}
      style={{
        backgroundColor: getBackgroundColor(),
      }}
    >
      {day && goal_number ? (
        <div className="absolute  right-0  top-0 rounded-full bg-red-300 px-1 text-sm dark:text-black">
          {goal_number}
        </div>
      ) : (
        ""
      )}
      <h2>{day}</h2>
    </div>
  );
}

export default Day;

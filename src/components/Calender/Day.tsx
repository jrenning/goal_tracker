import { Goals, RepeatData } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { api } from "~/utils/api";
import { ThemeContext, ThemeProvider } from "~/utils/theme";
import { useLoaded } from "../../hooks/useLoaded";

type DayProps = {
  day: number;
  month: number;
  year: number;
  goal_data: any[];
};

function getGoalsOnDay(date: Date, goals_in_range: any[]) {
  const day_map = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  const goals_data = goals_in_range;
  let goals: Goals[] = [];
  goals_data &&
    goals_data.forEach((goal) => {
      const day_num = date.getDay();
      if (date >= goal.repeat.start_date) {
        if (goal.repeat?.type == "Daily") {
          //@ts-ignore
          const day_nums = goal.repeat.days.map((day) => day_map[day]);
          if (day_nums.includes(day_num)) {
            goals.push(goal);
          }
        } else if (goal.repeat?.type == "Weekly") {
          if (day_num == goal.repeat.start_date.getDay()) {
            goals.push(goal);
          }
        } else if (goal.repeat?.type == "Monthly") {
          if (date.getDate() == goal.repeat.start_date.getDate()) {
            goals.push(goal);
          }
        } else {
          if (
            date.getDate() == goal.repeat?.start_date.getDate() &&
            date.getMonth() == goal.repeat?.start_date.getMonth()
          ) {
            goals.push(goal);
          }
        }
      }
    });
  return goals.length;
}

function Day({ day, month, year, goal_data }: DayProps) {
  const router = useRouter();
  const date = new Date(year, month, day);
  const today = new Date();

  const goal_number = getGoalsOnDay(date, goal_data);

  // const goal_number = api.goals.getRepeatingGoalsByDate.useQuery({
  //     date: date
  // }).data?.length

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

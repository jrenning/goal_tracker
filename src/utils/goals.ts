import { GoalsWithRepeat } from "~/server/api/routers/goals";
import {
  MonthlyInRange,
  YearlyInRange,
  getDaysBetweenDates,
  getDaysInRange,
  getMonthsBetweenDates,
  getWeeksBetweenDates,
  isRepeatInRange,
} from "./datetime";
import { DaysOfWeek, RepeatType } from "~/pages";

export function filterGoalsInRange(
  goals: GoalsWithRepeat,
  start: Date,
  end: Date
) {
  const day_map = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  let range_start;
  let range_end;
  const filtered_goals: GoalsWithRepeat = [];
  goals.forEach((goal) => {
    // know that in this range the goal COULD repeat, ie goal doesn't stop in range
    if (goal.repeat) {
      range_start =
        start < goal.repeat.start_date ? goal.repeat.start_date : start;
      if (goal.repeat.stop_date) {
        range_end = end < goal.repeat.stop_date ? end : goal.repeat.stop_date;
      } else {
        range_end = end;
      }

      let distance;
      let end_distance;
      let type = goal.repeat.type;
      if (type == "Daily") {
        distance = getDaysBetweenDates(goal.repeat.start_date, start);
        end_distance = getDaysBetweenDates(goal.repeat.start_date, end);
        if (goal.repeat.start_date.getTime() == start.getTime()) {
          filtered_goals.push(goal);
        } else if (
          isRepeatInRange(distance, end_distance, goal.repeat.repeat_frequency)
        ) {
          filtered_goals.push(goal);
        }
      } else if (type == "Weekly") {
        distance = getWeeksBetweenDates(goal.repeat.start_date, start);
        end_distance = getWeeksBetweenDates(goal.repeat.start_date, end);

        let days_included: number[] = [];

        // only include days of week in the weeks that are valid for the repeat type
        // if start week is valid but end is not set new end date to end of start week to get days included
        if (
          distance % goal.repeat.repeat_frequency == 0 &&
          !(end_distance % goal.repeat.repeat_frequency == 0)
        ) {
          const temp_start = new Date(
            range_start.getFullYear(),
            range_start.getMonth(),
            range_start.getDate()
          );
          range_end = new Date(
            temp_start.setDate(temp_start.getDate() + (6 - temp_start.getDay()))
          );
          days_included = getDaysInRange(range_start, range_end);
        } else if (
          end_distance % goal.repeat.repeat_frequency == 0 &&
          !(distance % goal.repeat.repeat_frequency == 0)
        ) {
          const temp_end = new Date(
            range_end.getFullYear(),
            range_end.getMonth(),
            range_end.getDate()
          );
          range_start = new Date(
            temp_end.setDate(temp_end.getDate() - temp_end.getDay())
          );
          days_included = getDaysInRange(range_start, range_end);
        } else if (
          end_distance % goal.repeat.repeat_frequency == 0 &&
          distance % goal.repeat.repeat_frequency == 0
        ) {
          days_included = getDaysInRange(range_start, range_end);
        } else {
          // if there is a valid week in between it will have all of the days
          if (
            (end_distance - distance) % goal.repeat.repeat_frequency == 0 &&
            end_distance - distance !== 0
          ) {
            days_included = [0, 1, 2, 3, 4, 5, 6];
          }
        }

        const days_in_goal = goal.repeat.days.map((day) => day_map[day]);

        // if they share days in common you're good
        if (days_included.some((r) => days_in_goal.indexOf(r) >= 0)) {
          filtered_goals.push(goal);
        }
      } else if (type == "Monthly") {
        distance = getMonthsBetweenDates(goal.repeat.start_date, start);
        end_distance = getMonthsBetweenDates(goal.repeat.start_date, end);
        if (goal.repeat.start_date.getTime() == start.getTime()) {
          filtered_goals.push(goal);
        } else if (
          MonthlyInRange(
            range_start,
            distance,
            range_end,
            end_distance,
            goal.repeat.repeat_frequency,
            goal.repeat.start_date
          )
        ) {
          filtered_goals.push(goal);
        }
      } else {
        distance = start.getFullYear() - goal.repeat.start_date.getFullYear();
        end_distance = end.getFullYear() - goal.repeat.start_date.getFullYear();
        if (goal.repeat.start_date.getTime() == start.getTime()) {
          filtered_goals.push(goal);
        } else if (
          YearlyInRange(
            range_start,
            distance,
            range_end,
            end_distance,
            goal.repeat.repeat_frequency,
            goal.repeat.start_date
          )
        ) {
          filtered_goals.push(goal);
        }
      }
    }
  });
  return filtered_goals;
}

export function getRepeatTypeString(
  repeat_type: RepeatType | undefined,
  frequency: number | undefined,
  days: DaysOfWeek[] | undefined
) {
  if (repeat_type && frequency && days) {
    const string_map = {
      Daily: "day",
      Weekly: "week",
      Monthly: "month",
      Yearly: "year",
    };
    if (repeat_type !== "Weekly") {
      if (frequency == 1) {
        return `Repeats every ${string_map[repeat_type]}`;
      } else {
        return `Repeats every ${frequency} ${string_map[repeat_type]}s`;
      }
    }
    return `Repeats weekly on ${days.join(",")}`;
  }
  return "Never Repeats"
}

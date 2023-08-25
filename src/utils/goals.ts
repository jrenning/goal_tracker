import { GoalsWithRepeat, ShopItemsWithRepeat } from "~/server/api/routers/goals";
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

// interface Repeat  {
//   repeat: RepeatData | null
// }

// interface RepeatData  {
//   start_date: Date
//   stop_date: Date
//   type: RepeatType
//   repeat_frequency: number
//   days: DaysOfWeek[]
// }

export function filterItemsInRange(
  items: GoalsWithRepeat | ShopItemsWithRepeat,
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
  const filtered_items: typeof items | any = [];
  items.forEach((item) => {
    // know that in this range the item COULD repeat, ie item doesn't stop in range
    if (item.repeat) {
      range_start =
        start < item.repeat.start_date ? item.repeat.start_date : start;
      if (item.repeat.stop_date) {
        range_end = end < item.repeat.stop_date ? end : item.repeat.stop_date;
      } else {
        range_end = end;
      }


      let distance;
      let end_distance;
      let type = item.repeat.type;
      if (type == "Daily") {
        distance = getDaysBetweenDates(item.repeat.start_date, range_start);
        end_distance = getDaysBetweenDates(item.repeat.start_date, range_end);
        if (item.repeat.start_date.getTime() == range_start.getTime()) {
          filtered_items.push(item);
        } else if (
          isRepeatInRange(distance, end_distance, item.repeat.repeat_frequency)
        ) {
          filtered_items.push(item);
        }
      } else if (type == "Weekly") {
        distance = getWeeksBetweenDates(item.repeat.start_date, range_start);
        end_distance = getWeeksBetweenDates(item.repeat.start_date, range_end);
        let days_included: number[] = [];

        // only include days of week in the weeks that are valid for the repeat type
        // if start week is valid but end is not set new end date to end of start week to get days included
        if (
          distance % item.repeat.repeat_frequency == 0 &&
          !(end_distance % item.repeat.repeat_frequency == 0)
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
          end_distance % item.repeat.repeat_frequency == 0 &&
          !(distance % item.repeat.repeat_frequency == 0)
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
          end_distance % item.repeat.repeat_frequency == 0 &&
          distance % item.repeat.repeat_frequency == 0
        ) {
          
          days_included = getDaysInRange(range_start, range_end);
        } else {
          console.log("Here");
          // if there is a valid week in between it will have all of the days
          if (
            (end_distance - distance) % item.repeat.repeat_frequency == 0 &&
            end_distance - distance !== 0
          ) {
            days_included = [0, 1, 2, 3, 4, 5, 6];
          }
        }

        const days_in_item = item.repeat.days.map((day) => day_map[day]);

        // if they share days in common you're good
        if (days_included.some((r) => days_in_item.indexOf(r) >= 0)) {
          filtered_items.push(item);
        }
      } else if (type == "Monthly") {
        distance = getMonthsBetweenDates(item.repeat.start_date, range_start);
        end_distance = getMonthsBetweenDates(item.repeat.start_date, range_end);
        if (item.repeat.start_date.getTime() == start.getTime()) {
          filtered_items.push(item);
        } else if (
          MonthlyInRange(
            range_start,
            distance,
            range_end,
            end_distance,
            item.repeat.repeat_frequency,
            item.repeat.start_date
          )
        ) {
          filtered_items.push(item);
        }
      } else {
        distance = range_start.getFullYear() - item.repeat.start_date.getFullYear();
        end_distance = range_end.getFullYear() - item.repeat.start_date.getFullYear();
        if (item.repeat.start_date.getTime() == start.getTime()) {
          filtered_items.push(item);
        } else if (
          YearlyInRange(
            range_start,
            distance,
            range_end,
            end_distance,
            item.repeat.repeat_frequency,
            item.repeat.start_date
          )
        ) {
          filtered_items.push(item);
        }
      }
    }
  });
  return filtered_items;
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
    if (frequency == 1){
      return `Repeats weekly on ${days.join(", ")}`;
    }
    else {
      return `Repeats every ${frequency} weeks on ${days.join(", ")}`
    }
    
  }
  return "Never Repeats";
}

export function calculateExp(
  difficulty: number,
  checklist_items: number | undefined,
  due_date: Date | undefined,
  repeating: boolean
) {
  let exp = 0;

  exp += 2 * difficulty;
  if (checklist_items) {
    if (checklist_items >= 4) {
      exp += 4;
    } else {
      exp += checklist_items;
    }
  }
  if (due_date) {
    const days = getDaysBetweenDates(new Date(), due_date);

    if (days <= 1) {
      exp += 3;
    } else if (days <= 2) {
      exp += 2;
    } else if (days < 3) {
      exp += 1;
    }
  }

  if (repeating) {
    exp -= 2;
  }

  return exp == 0 ? 1 : exp;
}

export function calculateCoins(exp: number) {
  return Math.floor(exp / 2);
}

export function generateMultiplier() {
  const num = Math.floor(Math.random() * 100);

  // one out of 100 give double
  if (num == 0) {
    return 2;
  }

  // 5 more out of 100 give 1.5x
  if (num > 0 && num < 6) {
    return 1.5;
  }

  // 5 more give 1.2
  if (num >= 6 && num < 11) {
    return 1.2;
  }

  return 1;
}

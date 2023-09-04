import { DaysOfWeek, RepeatType } from "~/pages";

export function convertToUTC(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
}

export function dateOverWeekAway(start: Date, end: Date) {
  return (
    end.getDate() - start.getDate() >= 7 ||
    end.getMonth() > start.getMonth() ||
    end.getFullYear() > start.getFullYear()
  );
}

export function getDaysInRange(start: Date, end: Date) {
  let start_copy = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  let days_of_week = [];
  let i = 0;
  while (i < 7 && start_copy.getTime() <= end.getTime()) {
    days_of_week.push(start_copy.getDay());
    start_copy.setDate(start_copy.getDate() + 1);
    i++;
  }
  return days_of_week;
}

export function getDaysBetweenDates(start: Date, end: Date) {
  // cast out of order dates to 0 result, avoids weird math elsewhere
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 24 * 3600)) < 0
    ? 0
    : Math.floor((end.getTime() - start.getTime()) / (1000 * 24 * 3600));
}

export function getWeeksBetweenDates(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 24 * 3600 * 7));
}

export function getTodayAtMidnight() {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  return today;
}

export function getLeadingZeroFormat (month_or_day: number) {
  if (month_or_day < 10) {
    return `0${month_or_day}`;
  } else {
    return month_or_day;
  }
};

export function getDateInputFormatString(date: Date) {
    return `${date.getFullYear()}-${getLeadingZeroFormat(
      date.getMonth() + 1
    )}-${getLeadingZeroFormat(date.getDate())}`;
}

export function getMonthsBetweenDates(start: Date, end: Date) {
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();
  return months <= 0 ? 0 : months;
}

export function isRepeatInRange(
  distance: number,
  end_distance: number,
  repeat_freq: number
) {
  if (distance % repeat_freq == 0 && distance !== 0) {
    return true;
  } else {
    if (
      !(
        Math.floor(distance / repeat_freq) ==
        Math.floor(end_distance / repeat_freq)
      )
    ) {
      return true;
    }
    return false;
  }
}

export function MonthlyInRange(
  start: Date,
  distance: number,
  end: Date,
  end_distance: number,
  freq: number,
  start_date: Date
) {
  const end_of_start_month = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    0
  );
  const begin_of_end_month = new Date(end.getFullYear(), end.getMonth(), 1);
  if (distance % freq == 0 && end_distance % freq !== 0) {
    const new_end = end_of_start_month;
    if (
      start_date.getDate() <= new_end.getDate() &&
      start_date.getDate() >= start.getDate()
    ) {
      return true;
    }
  } else if (distance % freq !== 0 && end_distance % freq == 0) {
    const new_start = begin_of_end_month;
    if (
      start_date.getDate() <= end.getDate() &&
      start_date.getDate() >= new_start.getDate()
    ) {
      return true;
    }
  } else if (distance % freq == 0 && end_distance % freq == 0) {
    if (start.getMonth() == end.getMonth()) {
      if (
        start_date.getDate() <= end.getDate() &&
        start_date.getDate() >= start.getDate()
      ) {
        return true;
      }
    } else if (
      start_date.getDate() <= end.getDate() ||
      start_date.getDate() >= start.getDate()
    ) {
      return true;
    }
    return false;
  } else {
    if (
      (end_distance - distance) % freq == 0 &&
      end_distance - distance !== 0
    ) {
      return true;
    }
    return false;
  }
}

export function YearlyInRange(
  start: Date,
  distance: number,
  end: Date,
  end_distance: number,
  freq: number,
  start_date: Date
) {
  const end_of_start_year = new Date(start.getFullYear(), 11, 31);
  const begin_of_end_year = new Date(end.getFullYear(), 0, 1);
  if (distance % freq == 0 && end_distance % freq !== 0) {
    const new_end = end_of_start_year;
    const new_start_date = new Date(
      start.getFullYear(),
      start_date.getMonth(),
      start_date.getDate()
    );
    if (
      new_start_date.getTime() <= new_end.getTime() &&
      new_start_date.getTime() >= start.getTime()
    ) {
      return true;
    }
  } else if (distance % freq !== 0 && end_distance % freq == 0) {
    const new_start = begin_of_end_year;
    const new_start_date = new Date(
      end.getFullYear(),
      start_date.getMonth(),
      start_date.getDate()
    );
    if (
      new_start_date.getTime() <= end.getTime() &&
      new_start_date.getTime() >= new_start.getTime()
    ) {
      return true;
    }
  } else if (distance % freq == 0 && end_distance % freq == 0) {
    const new_start_date = new Date(
      end.getFullYear(),
      start_date.getMonth(),
      start_date.getDate()
    );
    if (
      new_start_date.getTime() <= end.getTime() &&
      new_start_date.getTime() >= start.getTime()
    ) {
      return true;
    }
    return false;
  } else {
    if (
      (end_distance - distance) % freq == 0 &&
      end_distance - distance !== 0
    ) {
      return true;
    }
    return false;
  }
}

export function getNextRepeat(
  repeatType: RepeatType,
  repeat_freq: number,
  days: DaysOfWeek[]
) {
  // TODO
}

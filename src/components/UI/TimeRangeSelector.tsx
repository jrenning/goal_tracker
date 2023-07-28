import React from 'react'

type TimeRangeProps = {
  setDateSearch: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setRunQuery: React.Dispatch<React.SetStateAction<boolean>>
};

function TimeRangeSelector({setDateSearch, setRunQuery}: TimeRangeProps) {

const today = new Date();

function startOfWeek(date: Date) {
    return new Date(today.setDate(date.getDate()-date.getDay()))
}

const fetchGoals = (value: string) => {
    const today = new Date()
    if (value == "Today") {
        today.setHours(0)
        setDateSearch(today)
    }
    else if (value == "This Week") {
        setDateSearch(startOfWeek(today))
    }
    else if (value == "This Month") {
        today.setDate(0)
        today.setHours(0)
        setDateSearch(today)
    }
    else if (value == "This Year") {
        today.setMonth(0)
        today.setDate(0)
        today.setHours(0)
        setDateSearch(today)
    }
    else {
        setDateSearch(new Date(0))
    }
    setRunQuery(true)

}


  return (
    <div className="m-2 my-4 w-fit rounded-md border border-black bg-slate-200 p-2 shadow-lg">
      <select
        onChange={(e) => fetchGoals(e.target.value)}
        className="bg-slate-200 font-semibold outline-none"
      >
        <option>Today</option>
        <option>This Week</option>
        <option>This Month</option>
        <option>This Year</option>
        <option>All Time</option>
      </select>
    </div>
  );
}

export default TimeRangeSelector
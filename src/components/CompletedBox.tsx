import React, { useState } from 'react'
import Title from './Title'
import { api } from '~/utils/api'
import Goal from './Goal'

function CompletedBox() {

const [dateSearch, setDateSearch] = useState<Date>()

const [runQuery, setRunQuery] = useState<boolean>(false)

const today = new Date()

const completed = api.goals.getCompletedGoals.useQuery({date: dateSearch ? dateSearch : today}, {enabled: runQuery})


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
    <div>
      <Title name="Completed" date={false} />
      <div>
        <select onChange={(e) => fetchGoals(e.target.value)}>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>
      <div className="m-4 flex h-full flex-col items-center justify-center space-y-4 border p-2">
        {completed.data
          ? completed.data.map((goal, index) => (
              <Goal
                name={goal.name}
                points={goal.points}
                category={goal.category}
                difficulty={goal.difficulty}
                id={goal.id}
                key={goal.id}
                disabled={true}
              />
            ))
          : ""}
      </div>
    </div>
  );
}

export default CompletedBox
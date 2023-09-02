import React, { useEffect, useMemo, useState } from "react";
import Title from "../UI/Title";
import { api } from "~/utils/api";
import Goal from "./Goal";
import TimeRangeSelector from "../UI/TimeRangeSelector";

function CompletedBox() {
  const today = new Date()
  const [dateSearch, setDateSearch] = useState<Date | undefined>(undefined);

  const [runQuery, setRunQuery] = useState<boolean>(false);

  // let completed = api.goals.getCompletedGoals.useQuery(
  //   { date: dateSearch ? dateSearch : today },
  //   { enabled: runQuery }
  // );
  // default to getting today's completed goals
  let completed = api.goals.getCompletedGoals.useQuery({
    date: dateSearch
  });

  return (
    <div className="mt-8">
      <TimeRangeSelector
        setDateSearch={setDateSearch}
        setRunQuery={setRunQuery}
      />
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
                due_date={goal.due_date}
              />
            ))
          : ""}
      </div>
    </div>
  );
}

export default CompletedBox;

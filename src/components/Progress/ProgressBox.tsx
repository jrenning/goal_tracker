import React from "react";
import { api } from "~/utils/api";
import ProgressBar from "./ProgressBar";
import { GoalCategories } from "~/pages";

function ProgressBox() {
  const {data, isLoading} = api.user.getUserStats.useQuery()

  let levels: number[] = [];
  let points: number[] = [];
  let categories: GoalCategories[] = [];

  if (data) {
    data.stats.forEach((stat) => {
      levels.push(stat.level);
      points.push(stat.current_points);
      categories.push(stat.category);
    });
  }

  return (
    <div className="grid grid-cols-2 items-center justify-center">
      {points &&
        points.map((point, index) => (
          <ProgressBar
            key={index}
            //@ts-ignore
            level={levels[index] ? levels[index] : 1}
            points={point ? point : 0}
            //@ts-ignore
            category={categories[index]}
          />
        ))}
    </div>
  );
}

export default ProgressBox;

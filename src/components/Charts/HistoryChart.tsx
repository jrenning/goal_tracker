import React from "react";
import { GoalCategories } from "~/pages";
import LineChart, { Dataset } from "./LineChart";
import { api } from "~/utils/api";
import { colors } from "~/utils/colors";

export type ChartTypes = "Points" | "Level";

type PointsChartProps = {
  category: GoalCategories;
  start_date: Date;
  type: ChartTypes;
};

function HistoryChart({ category, start_date, type }: PointsChartProps) {
  const point_data = api.history.getPointDataByCategoryDate.useQuery({
    category: category,
    date: start_date,
  }).data;

  const level_data = api.history.getLevelDataByCategoryDate.useQuery({
    category: category,
    date: start_date,
  }).data;

  const levels = level_data
    ? level_data.map((item) => {
        return item.level;
      })
    : [];
  const level_dates = level_data
    ? level_data.map((item) => {
        return `${item.date.getMonth() + 1}-${item.date.getDate()}-${item.date
          .getFullYear()
          .toString()
          .slice(2, 4)}`;
      })
    : [];
  const points = point_data
    ? point_data.map((item) => {
        return item.points;
      })
    : [];
  const point_dates = point_data
    ? point_data.map((item) => {
        return `${item.date.getMonth() + 1}-${item.date.getDate()}-${item.date
          .getFullYear()
          .toString()
          .slice(2, 4)}`;
      })
    : [];

  const fill_color = colors[category] ? colors[category] : "rgb(100,100,100)";

  const data: Dataset[] = [
    {
      label: "Series 1",
      data: type === "Points" ? points : levels,
      fill: true,
      backgroundColor: fill_color ? fill_color : "rgb(100,100,100)",
      borderColor: "rgb(100,100,100)",
      tension: 0.8,
    },
  ];

  return (
    <div className="mt-4 flex items-center justify-center">
      <LineChart
        labels={type == "Points" ? point_dates : level_dates}
        datasets={data}
      />
    </div>
  );
}

export default HistoryChart;

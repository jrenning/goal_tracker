import React, { ReactNode, useState } from "react";
import { GoalCategories } from "~/pages";
import { goal_categories } from "~/server/api/routers/goals";
import HistoryChart, { ChartTypes } from "./HistoryChart";
import PageTransitionLayout from "../Transitions/PageTransitionLayout";

function ProgressPage() {
  return (
    <PageTransitionLayout>
      <div className="mt-8">
        <ChartBox type="Points" title="Points" />
        <ChartBox type="Level" title="Levels" />
      </div>
    </PageTransitionLayout>
  );
}

type ChartBoxType = {
  type: ChartTypes;
  title: string;
};

function ChartBox({ type, title }: ChartBoxType) {
  const [category, setCategory] = useState<GoalCategories>("Physical");
  const [startDate, setStartDate] = useState<Date>(new Date());
  return (
    <div className="mt-4">
      <div className="mx-8 flex items-center justify-center rounded-md bg-green-300 text-3xl font-semibold shadow-md">
        <h1>{title}</h1>
      </div>
      <HistoryChart category={category} start_date={startDate} type={type} />
      <div className="mx-8 mt-8 flex flex-row items-center justify-center space-x-4  rounded-md bg-green-100 pb-4">
        <div className="flex flex-col space-y-2 text-center">
          <label htmlFor="category" className="font-semibold">
            Category
          </label>
          <select
            onChange={(e) => {
              const target = e.target as typeof e.target & {
                value: GoalCategories;
              };
              setCategory(target.value);
            }}
            id="category"
            className="select-primary"
          >
            <option>Physical</option>
            <option>Education</option>
            <option>Social</option>
            <option>Hobby</option>
            <option>Odd_Job</option>
          </select>
        </div>
        <div className="flex flex-col space-y-2 text-center">
          <label htmlFor="date" className="font-semibold">
            Start Date
          </label>
          <input
            className="select-primary"
            type="date"
            id="date"
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;

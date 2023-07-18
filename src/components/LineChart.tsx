import { Color } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

export type Dataset = {
    label: string,
    data: number[]
    fill: boolean
    borderColor: Color
    tension: number
}

type LineChartProps = {
    labels: string[],
    datasets: Dataset[]
    title?: string
}

function LineChart({ labels, datasets, title }: LineChartProps) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Line Chart</h2>
      <Line
        data={{
          labels: labels,
          datasets: datasets,
        }}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: title ? true : false,
              text: title,
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
export default LineChart;

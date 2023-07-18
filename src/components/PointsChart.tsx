import React from 'react'
import { GoalCategories } from '~/pages'
import LineChart, { Dataset } from './LineChart'
import { api } from '~/utils/api'

type PointsChartProps = {
    category: GoalCategories
}

function PointsChart({category}: PointsChartProps) {

const goals = api.goals.getGoalsByCategory.useQuery({
    category: category
}).data

let points: number[] = []
goals && goals.forEach((goal)=> {
    points.push(goal.points)
})
//@ts-ignore
const cumulativeSum = (sum=> value => sum+=value)(0)
let point_data = points.map(cumulativeSum)




const data: Dataset[] = [{
    label: "Series 1",
    data: point_data,
    fill: true,
    borderColor: "rgb(100,100,100)",
    tension: 0.8
}]

  return (
    <div className='mx-16'>
        <LineChart labels={Array(point_data.length).fill("1")} datasets={data} />
    </div>
  )
}

export default PointsChart
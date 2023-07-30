import React from 'react'
import { GoalCategories, RepeatType } from '~/pages'
import { Checklist } from '../Goals/Goal'


export type GoalModalProps = {
    name: string
    exp: number
    category: GoalCategories,
    repeatType?: RepeatType,
    checklist?: Checklist[],
    date_created: Date
    date_due?: Date

}

function GoalModal({name, exp, category, repeatType, checklist, date_created, date_due}: GoalModalProps) {
  return (
    <div>
        <div>Worth {exp} points</div>
        <div>Category: {category}</div>

        <div>Repeat Type: {repeatType}</div>

        <div>Checklist</div>
        {checklist ? checklist.map((item)=> (
            <li>{item.name}</li>
        )): ""}

        {date_created && <div>Created: {date_created.toDateString()}</div>}

        {date_due && <div>Due: {date_due.toDateString()}</div>}


    </div>
  )
}

export default GoalModal
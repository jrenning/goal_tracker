import React from 'react'
import { GoalCategories, RepeatType } from '~/pages'
import { Checklist } from '../Goals/Goal'
import Pill from '../Goals/Pill'
import { api } from '~/utils/api'
import { getRepeatTypeString } from '~/utils/goals'


export type GoalModalProps = {
    id: number
    category: GoalCategories
    name: string

}

function GoalModal({id}: GoalModalProps) {

  const goal = api.goals.getGoalById.useQuery({
    id: id
  }).data

  if (!goal) {
    return <div>Goal not found, please return to the home page</div>
  }

  return (
    <div className="mt-4 grid w-full grid-cols-2 items-center justify-center gap-8 p-8">
      <Pill backgroundColor="#eeeeee">
        <div className="w-full text-lg font-semibold">Worth {goal.points} points</div>
      </Pill>
      <Pill backgroundColor="#eeeeee">
        <div className="text-lg font-semibold">Category: {goal.category}</div>
      </Pill>

      <Pill backgroundColor="#eeeeee">
        <div className="text-lg font-semibold">
          {getRepeatTypeString(goal?.repeat?.type, goal?.repeat?.repeat_frequency, goal?.repeat?.days)}
        </div>
      </Pill>

      <Pill backgroundColor='#eeeeee'>
        <div className='text-lg font-semibold'>Checklist</div>
        {goal.checklist ? (
          goal.checklist.map((item) => <li>{item.name}</li>)
        ) : (
          <div>None</div>
        )}
      </Pill>

      {goal.created_at && (
        <Pill backgroundColor="#eeeeee">
          <div className="text-lg font-semibold">
            Created: {goal.created_at.toDateString()}
          </div>
        </Pill>
      )}

      {goal.due_date && (
        <Pill backgroundColor="#eeeeee">
          <div className="text-lg font-semibold">
            Due: {goal.due_date.toDateString()}
          </div>
        </Pill>
      )}
    </div>
  );
}

export default GoalModal
import React from 'react'
import { GoalCategories, RepeatType } from '~/pages'
import { Checklist } from '../Goals/Goal'
import Pill from '../Goals/Pill'
import { api } from '~/utils/api'
import { getRepeatTypeString } from '~/utils/goals'
import { colors } from '~/utils/colors'


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
    <div className="mt-4 grid grid-cols-2 w-full items-center justify-center gap-4 rounded-md bg-slate-100 p-8 shadow-md">
      <div className="flex flex-col space-y-8">
        <Pill backgroundColor="#eeeeee">
          <div className="w-full text-lg font-semibold">
            {goal.points} points
          </div>
        </Pill>
        <Pill backgroundColor={`${colors[goal.category]}`}>
          <div className="text-lg font-semibold">{goal.category}</div>
        </Pill>
        <div>
          {goal.checklist && goal.checklist.length > 0 ? <div className="flex flex-col text-lg font-bold ">Checklist</div> : ""}
          {goal.checklist ? (
            goal.checklist.map((item) => <li>{item.name}</li>)
          ) : (
            <div>None</div>
          )}
        </div>
      </div>
      <div className='flex flex-col space-y-6'>
        <div>
          <div className="justify-left flex items-center text-2xl font-bold">
            &#x26AF;
          </div>
          <div className="text-lg font-semibold">
            {getRepeatTypeString(
              goal?.repeat?.type,
              goal?.repeat?.repeat_frequency,
              goal?.repeat?.days
            )}
          </div>
        </div>

        {goal.created_at && (
          <div className='w-full'>
            <div className="justify-left flex items-center text-2xl font-bold">
              &#x2690;
            </div>
            <div className="text-lg font-semibold">
              Created: {goal.created_at.toDateString()}
            </div>
          </div>
        )}

        {goal.due_date && (
          <div className="w-full">
            <div className="justify-left flex items-center text-2xl font-bold">
              &#x2691;
            </div>
            <div className="text-lg font-semibold">
              Due: {goal.due_date.toDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalModal
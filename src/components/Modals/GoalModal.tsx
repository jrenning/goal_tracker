import React from 'react'
import { GoalCategories, RepeatType } from '~/pages'
import { Checklist } from '../Goals/Goal'
import Pill from '../Goals/Pill'
import { api } from '~/utils/api'
import { getRepeatTypeString } from '~/utils/goals'
import { colors } from '~/utils/colors'
import EditableSection from '../UI/EditableSection'
import useDataActions from '~/hooks/useDataActions'


export type GoalModalProps = {
    id: number
    category: GoalCategories
    name: string

}

const FireIcon = <svg viewBox="0 0 448 512"><path d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"/></svg>

function GoalModal({id}: GoalModalProps) {

  const goal = api.goals.getGoalById.useQuery({
    id: id
  }).data

  const delete_call = api.goals.deleteGoal.useMutation();

  if (!goal) {
    return <div>Goal not found, please return to the home page</div>
  }

  const getDifficulty = () => {
    let content = []
    for (let i=0; i<goal.difficulty; i++) {
      content.push(<div key={i} className='w-6 h-6'>{FireIcon}</div>)
    }

    return content
  }

  



  return (
    <>
      <div className="mt-4 grid h-[20rem] w-full grid-cols-2 items-start justify-center gap-4 overflow-y-scroll rounded-md bg-slate-100 p-8 shadow-md">
        <div className="flex flex-col space-y-8">
          <Pill backgroundColor="#eeeeee">
            <div className="w-full text-lg font-semibold">
              {goal.points} points
            </div>
          </Pill>
          <Pill backgroundColor={`${colors[goal.category]}`}>
            <div className="text-lg font-semibold">{goal.category}</div>
          </Pill>
          <div className="flex flex-row space-x-4">{getDifficulty()}</div>
          <div>
            {goal.checklist && goal.checklist.length > 0 ? (
              <div className="flex flex-col text-lg font-bold ">Checklist</div>
            ) : (
              ""
            )}
            {goal.checklist ? (
              goal.checklist.map((item) => <li>{item.name}</li>)
            ) : (
              <div>None</div>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-6">
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
            <div className="w-full">
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
      <div className="mt-4 flex w-full items-center justify-center space-x-8">
        <button className="flex shadow-lg border-black border items-center justify-center rounded-md bg-red-300 px-2 py-1 text-3xl font-semibold"
        onClick={async()=> await delete_call.mutateAsync({
          goal_id: goal.id
        })}>
          Delete
        </button>
        <button className="flex shadow-lg border-black border items-center justify-center rounded-md bg-green-300 px-2 py-1 text-3xl font-semibold">
          Save
        </button>
      </div>
    </>
  );
}

export default GoalModal
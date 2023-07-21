import React, { useState } from 'react'
import GoalForm from '~/components/GoalForm'

function add_goal() {
    const [goal, setNewGoal] = useState(true)
  return (
    <div>
        <GoalForm setNewGoal={setNewGoal}/>
    </div>
  )
}

export default add_goal
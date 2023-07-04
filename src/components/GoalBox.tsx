"use client";

import React, { useState } from "react";
import Goal from "./Goal";
import Title from "./Title";
import { api } from "~/utils/api";

type Goal = {};

function GoalBox() {
  const goals = api.goals.getCurrentGoals.useQuery();

  const utils = api.useContext();

  const add_call = api.goals.addGoal.useMutation({
    async onSuccess(data) {
      utils.goals.invalidate();
      data && alert(`${data.name} was added!!`);
    },
  });

  const createGoal = async (e: any) => {
    e.preventDefault()
    await add_call.mutateAsync({
      name: e.target[0].value,
      exp: Number(e.target[1].value),
      difficulty: Number(e.target[2].value)
    })

    setNewGoal(false)
  }

  const [newGoal, setNewGoal] = useState(false);

  return (
    <div>
      <div className=" flex h-full flex-col items-center justify-center space-y-4 border p-2">
        {goals.data
          ? goals.data.map((goal, index) => (
              <Goal
                name={goal.name}
                points={goal.points}
                difficulty={goal.difficulty}
                id={goal.id}
                key={goal.id}
                disabled={false}
              />
            ))
          : ""}
      </div>
      <div className="flex items-center justify-center">
        {!newGoal ? (
          <button
            className="rounded-md bg-green-300 px-4 py-[5px] shadow-lg hover:bg-slate-100"
            onClick={() => setNewGoal(true)}
          >
            Add Goal
          </button>
        ) : (
          ""
        )}
      </div>

      {newGoal ? (
        <div className="mx-16 my-4  rounded-lg bg-green-100 py-4">
          <button
            className="ml-2 rounded-full bg-red-200 px-2 py-0 hover:opacity-80"
            onClick={() => setNewGoal(false)}
          >
            X
          </button>
          <div className="flex items-center justify-center">
            <form className="items-left flex flex-col space-y-4 "
            onSubmit={(e)=> createGoal(e)}>
              <label>Name</label>
              <input required={true} />
              <label>Exp</label>
              <input type="number" required={true}></input>
              <label>Difficulty</label>
              <input
                type="range"
                list="difficulties"
                min={1}
                max={4}
                required={true}
              ></input>
              <datalist id="difficulties">
                <option value={1}></option>
                <option value={2}></option>
                <option value={3}></option>
                <option value={4}></option>
              </datalist>
              <button
                type="submit"
                className=" rounded-md bg-green-200 px-4 py-[5px] hover:opacity-70"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default GoalBox;

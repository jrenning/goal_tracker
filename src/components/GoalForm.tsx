import React, { FormEvent } from "react";
import { GoalCategories } from "~/pages";
import { api } from "~/utils/api";

type GoalFormProps = {
  setNewGoal: React.Dispatch<React.SetStateAction<boolean>>;
};

function GoalForm({ setNewGoal }: GoalFormProps) {


  const utils = api.useContext();

  const add_call = api.goals.addGoal.useMutation({
    async onSuccess(data) {
      await utils.goals.invalidate();
      data && alert(`${data.name} was added!!`);
    },
  });

  const createGoal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      exp: { value: string };
      difficulty: { value: string };
      category: { value: GoalCategories };
    };

    await add_call.mutateAsync({
      name: target.name.value,
      exp: Number(target.exp.value),
      difficulty: Number(target.difficulty.value),
      category: target.category.value,
    });

    setNewGoal(false);
  };

  return (
    <div className="mx-16 my-4  rounded-lg bg-green-100 py-4">
      <button
        className="ml-2 rounded-full bg-red-200 px-2 py-0 hover:opacity-80"
        onClick={() => setNewGoal(false)}
      >
        X
      </button>
      <div className="flex items-center justify-center">
        <form
          className="items-left flex flex-col space-y-4 "
          onSubmit={(e) => createGoal(e)}
        >
          <label htmlFor="name">Name</label>
          <input required={true} id="name" />
          <label htmlFor="category">Category</label>
          <select id="category">
            <option>Physical</option>
            <option>Education</option>
            <option>Social</option>
            <option>Hobby</option>
            <option>Odd Job</option>
          </select>
          <label htmlFor="exp">Exp</label>
          <input type="number" required={true} id="exp"></input>
          <label htmlFor="difficulty">Difficulty</label>
          <input
            type="range"
            list="difficulties"
            min={1}
            max={4}
            required={true}
            id="difficulty"
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
  );
}

export default GoalForm;

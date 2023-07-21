import { RewardCategories } from "@prisma/client";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { GoalCategories } from "~/pages";
import { api } from "~/utils/api";

type RewardFormProps = {
  backlink: string
};

function RewardForm({ backlink }: RewardFormProps) {
    const router = useRouter()
  const reward_creation_call = api.rewards.createReward.useMutation({
    async onSuccess (data) {
        alert(`Reward ${data.rewards[data.rewards.length-1]} was added to ${data.category} for level ${data.level}`)
    }
  });

  const createReward = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      reward_category: { value: RewardCategories };
      goal_category: { value: GoalCategories };
      level: { value: number };
    };

    await reward_creation_call.mutateAsync({
      name: target.name.value,
      level: Number(target.level.value),
      reward_category: target.reward_category.value,
      goal_category: target.goal_category.value,
    });

    router.push(backlink)
  };

  return (
    <div className="mx-16 my-4  rounded-lg bg-green-100 py-4">
      <button
        className="ml-2 rounded-full bg-red-200 px-2 py-0 hover:opacity-80"
        onClick={() => router.push(backlink)}
      >
        X
      </button>
      <div className="flex items-center justify-center ">
        <form
          className="items-left flex flex-col space-y-4 "
          onSubmit={(e) => createReward(e)}
        >
          <label htmlFor="name">Name</label>
          <input required={true} id="name" />
          <label htmlFor="reward_category">Reward Category</label>
          <select id="reward_category">
            <option>Outdoors</option>
            <option>Gift</option>
            <option>Leisure</option>
            <option>Food</option>
            <option>Experience</option>
          </select>
          <label htmlFor="goal_category">Goal Category</label>
          <select id="goal_category">
            <option>Physical</option>
            <option>Education</option>
            <option>Social</option>
            <option>Hobby</option>
            <option>Odd Job</option>
          </select>
          <label htmlFor="level">Level</label>
          <input type="number" required={true} id="level" className="text-center font-semibold"></input>
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

export default RewardForm;

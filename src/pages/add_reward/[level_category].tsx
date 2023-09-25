import { useRouter } from 'next/router'
import React from 'react'
import RewardForm from '~/components/Rewards/RewardForm';
import PopupTransitionLayout from '~/components/Transitions/PopupTransitionLayout';
import { GoalCategories } from '..';

function levelCategoryAdd() {
  const router = useRouter();
  //@ts-ignore
  const router_data: string = (router.query.level_category as string)
    ? router.query.level_category
    : "";

    const [level, category] = router_data.split("-")

    console.log(level)
    console.log(category)

  return (
    <PopupTransitionLayout keyName="update_goal">
      <div className="h-full w-screen bg-green-50">
        <RewardForm backlink="/" category={category as GoalCategories} level={Number(level)} />
      </div>
    </PopupTransitionLayout>
  );
}

export default levelCategoryAdd
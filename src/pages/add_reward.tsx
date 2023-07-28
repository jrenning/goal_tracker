import React from "react";
import PopupTransitionLayout from "~/components/Transitions/PopupTransitionLayout";
import RewardForm from "~/components/Rewards/RewardForm";

function add_reward() {
  return (
    <PopupTransitionLayout>
      <div className="h-full w-screen bg-green-50">
        <RewardForm backlink="/" />
      </div>
    </PopupTransitionLayout>
  );
}

export default add_reward;

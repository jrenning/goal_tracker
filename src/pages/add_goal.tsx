import React, { useState } from "react";
import GoalForm from "~/components/Goals/GoalForm";
import PopupTransitionLayout from "~/components/Transitions/PopupTransitionLayout";

function add_goal() {
  return (
    <PopupTransitionLayout>
      <div className="h-screen w-screen bg-green-50">
        <GoalForm backlink="/" />
      </div>
    </PopupTransitionLayout>
  );
}

export default add_goal;

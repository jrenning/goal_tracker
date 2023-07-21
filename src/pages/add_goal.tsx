import React, { useState } from "react";
import GoalForm from "~/components/GoalForm";
import PopupTransitionLayout from "~/components/PopupTransitionLayout";

function add_goal() {
  return (
    <PopupTransitionLayout>
        <div className="w-screen bg-green-50 h-screen">
      <GoalForm backlink="/" />
      </div>
    </PopupTransitionLayout>
  );
}

export default add_goal;

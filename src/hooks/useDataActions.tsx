import React from "react";
import { api } from "~/utils/api";
import usePopup from "./usePopup";

function useDataActions() {
  const utils = api.useContext();
  const { setErrorPopup, setSuccessPopup } = usePopup();

  const complete_goal_call = api.goals.completeGoal.useMutation({
    async onSuccess(data) {
      await utils.goals.invalidate();
      data && setSuccessPopup(`${data ? data.goal.name : "Goal"} was completed!!`);
    },
    async onError(err) {
      setErrorPopup(err.message);
    },
  });


  const gain_level_call = api.levels.gainLevel.useMutation({
    async onSuccess(data) {
      await utils.user.invalidate();
      await utils.levels.invalidate();
    },
    async onError(err) {
      setErrorPopup(err.message);
    },
  });

  const create_level_call = api.levels.createLevel.useMutation({
    async onSuccess(_) {
      await utils.levels.invalidate();
    },
    async onError(err) {
      setErrorPopup(err.message);
    },
  });

  const delete_goal_call = api.goals.deleteGoal.useMutation({
    async onSuccess(_) {
      await utils.goals.invalidate();
    },
    async onError(err) {
      setErrorPopup(err.message);
    },
  });

  const add_call = api.goals.addGoal.useMutation({
    async onSuccess(data) {
      await utils.goals.invalidate();
      data && alert(`${data.name} was added!!`);
    },
    async onError(err) {
      setErrorPopup(err.message);
    },
  });


  return {
    completeGoal: complete_goal_call,
    addGoal: add_call,
    gainLevel: gain_level_call,
    createLevel: create_level_call,
    deleteGoal: delete_goal_call,
  };
}

export default useDataActions;

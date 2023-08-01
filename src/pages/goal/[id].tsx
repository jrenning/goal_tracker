import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useModal from "~/hooks/useModal";
import { api } from "~/utils/api";

function GoalPage() {
  const router = useRouter();

  const id: string = router.query.id as string;

  console.log(router.query)

  const goal = api.goals.getGoalById.useQuery({
    id: Number(id),
  }).data;

  const { goalModal } = useModal();

  useEffect(() => {
    if (goal) {
      goalModal({
        name: goal.name,
        exp: goal.points,
        date_created: goal.created_at,
        checklist: goal.checklist,
        category: goal.category
      });
    }
  }, [id]);

  return <div></div>;
}

export default GoalPage;

import React from "react";
import { Checklist } from "./Goal";
import { api } from "~/utils/api";

type ChecklistProps = {
  checklist: Checklist[] | undefined;
};

function ChecklistView({ checklist }: ChecklistProps) {
    const utils = api.useContext()
  const complete_checklist_call =
    api.goals.completeGoalChecklistItem.useMutation({
      async onSuccess(_) {
        await utils.goals.invalidate();
      },
    });

  const completeChecklistItem = async (id: number) => {
    await complete_checklist_call.mutateAsync({
      id: id,
    });
  };
  return (
    <>
      <div className="mb-auto h-[1px] w-full bg-black"></div>
      <div className="flex flex-col space-y-4">
        {checklist
          ? checklist
              .map((item) => {
                return {
                  name: item.name,
                  completed: item.completed,
                  id: item.id,
                };
              })
              .map((item) => (
                <div className="flex flex-row items-center justify-between">
                  <div
                    className="px-4 text-xl font-bold"
                    style={{
                      textDecoration: item.completed ? "line-through" : "none",
                    }}
                  >
                    {item.name}
                  </div>
                  {!item.completed ? (
                    <button
                      className="bg-transparent px-6"
                      onClick={() => completeChecklistItem(item.id)}
                      disabled={item.completed}
                    >
                      &#x2714;
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              ))
          : ""}
      </div>
    </>
  );
}

export default ChecklistView;

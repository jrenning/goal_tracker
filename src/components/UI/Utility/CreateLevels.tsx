import React from "react";
import { api } from "~/utils/api";

function CreateLevels() {
  const levels = [
    {
      number: 1,
      points: 100,
    },
    {
        number: 2,
        points: 130
    },
    {
        number: 3,
        points: 160
    },
    {
        number: 4,
        points: 200
    },
    {
        number: 5,
        points: 250
    },
    {
        number: 6,
        points: 300
    },
    {
        number: 7,
        points: 350
    },
    {
        number: 8,
        points: 420
    },
    {
        number: 9,
        points: 500
    }
  ];

  const call = api.levels.createLevels.useMutation();

  const createLevels = async () => {
    await call.mutateAsync({
      levels: levels,
    });
  };

  return (
    <button className="rounded-md bg-blue-300 px-2 py-1 shadow-md"
    onClick={()=> createLevels()}>
      Create Items
    </button>
  );
}

export default CreateLevels;

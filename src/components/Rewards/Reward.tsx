import React from "react";
import { colors } from "~/utils/colors";

export type RewardCategories = "outdoors" | "gift" | "leisure" | "experience" | "food"

type RewardProps = {
  name: string;
  category: RewardCategories
};

function Reward({ name, category }: RewardProps) {


const bgColor = colors[`${category}_card`]
    

  return (
    <div className="w-fill flex h-[8rem] hover:scale-105 items-center justify-center rounded-md text-center shadow-md animate-bounce"
    style={{backgroundColor: bgColor}}>
      {name}
    </div>
  );
}

export default Reward;

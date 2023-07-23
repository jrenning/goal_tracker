import React, { useState } from 'react'
import AddButton from './AddButton';

function AddContentButton() {

const [addActive, setAddActive] = useState(false)
const [buttonMark, setButtonMark] = useState(true)
const adds = [
  { name: "Goal", link: "/add_goal" },
  { name: "Reward", link: "/add_reward" },
];

const handleClick = () => {
    setButtonMark(!buttonMark)
    setAddActive(!addActive)
}

  return (
    <div className="fixed left-[63%] top-[70%]">
      <div className="flex flex-col space-y-40 pr-12 justify-evenly">
        {addActive ? adds.map((add, index) => <AddButton name={add.name} link={add.link} number={index} key={add.name}/>) : ""}
      </div>
      <button
        className="fixed right-8 bottom-[6rem] flex h-20 w-20 cursor-pointer items-center
      justify-center rounded-full bg-green-300 text-2xl font-semibold text-white shadow-md hover:bg-gray-50 hover:text-black"
      onClick={()=> handleClick()}
      >
        {buttonMark ? "+" : "X"}
      </button>
    </div>
  );

}

export default AddContentButton
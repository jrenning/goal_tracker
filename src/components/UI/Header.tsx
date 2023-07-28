import React from "react";
import ThemeButton from "./ThemeButton";

type Props = {
  name: string;
};

function Header({ name }: Props) {
  return (
    <div className="text-bold w-100vw relative flex h-12 flex-row items-center justify-center bg-green-400 p-2 text-center font-bold text-white shadow-md">
      <div></div>
      <div className="text-black dark:text-white">{name}</div>
      <ThemeButton />
    </div>
  );
}

export default Header;

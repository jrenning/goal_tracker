import React from "react";
import ThemeButton from "./ThemeButton";
import Profile from "./Profile";
import { api } from "~/utils/api";
import Link from "next/link";

type Props = {
  name: string;
};

function Header({ name }: Props) {

const data = api.user.getUserCoins.useQuery().data

  return (
    <div className="text-bold w-100vw relative flex h-12 flex-row items-center justify-center bg-green-400 p-2 text-center font-bold text-white shadow-md">
      <div className="absolute left-4 flex flex-row space-x-4">
        <Profile />
        <div className=" flex flex-row items-center justify-center space-x-2">
          <div>{data?.coins} </div>
          <div className="text-lg font-bold  text-yellow-300">&#x274D;</div>
        </div>
      </div>
      <Link href={"/"}>
        <div className="text-black dark:text-white">{name}</div>
      </Link>
      <ThemeButton />
    </div>
  );
}

export default Header;

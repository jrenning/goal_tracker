import React, { useState } from "react";
import { ThemeContext } from "~/utils/theme";
import { useLoaded } from "./hooks/useLoaded";

function ThemeButton() {
    const loaded = useLoaded()
  const { theme, setTheme } = React.useContext(ThemeContext);
  const toggleTheme = () => {
    const root_list = document.documentElement.classList
    if (theme == "light") {
      setTheme && setTheme("dark");
      root_list.add("bg-[#121212]")
      root_list.remove("bg-white")
    } else {
      setTheme && setTheme("light");
       root_list.add("bg-white");
        root_list.remove("bg-[#121212");
    }
  };
  const themeIcon = theme == "light" && loaded ? <>&#x2600;</> : <>&#x2605;</>;
  return (
    <button
      onClick={() => toggleTheme()}
      className="bg-secondary_color absolute right-4
        flex items-center justify-center rounded-[50%] bg-blue-200 dark:bg-gray-300 w-8 h-8"
    >
      {themeIcon}
    </button>
  );
}

export default ThemeButton;

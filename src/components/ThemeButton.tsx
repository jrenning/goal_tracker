import React from "react";
import { ThemeContext } from "~/utils/theme";

function ThemeButton() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const toggleTheme = () => {
    if (theme == "light") {
      setTheme && setTheme("dark");
    } else {
      setTheme && setTheme("light");
    }
  };
  return (
    <button
      onClick={toggleTheme}
      className="bg-secondary_color mr-4 flex
        items-center justify-center rounded-[50%] p-1"
    >
      Update Theme
    </button>
  );
}

export default ThemeButton;

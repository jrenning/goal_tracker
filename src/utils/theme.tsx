import React, { ReactNode } from "react";

// found here https://javascript.plainenglish.io/light-and-dark-mode-in-react-web-application-with-tailwind-css-89674496b942

export const getInitialTheme = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem("color-theme");
    if (typeof storedPrefs === "string") {
      return storedPrefs;
    }

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches) {
      return "dark";
    }
  }

  return "light"; // light theme as the default;
};

type ThemeContextType = {
    theme: string
    setTheme: React.Dispatch<React.SetStateAction<string>> | undefined
}

export const ThemeContext = React.createContext<ThemeContextType>({theme: "light", setTheme: undefined});

type ThemeProps = {
    initialTheme: string
    children: ReactNode
}

export const ThemeProvider = ({ initialTheme, children }: ThemeProps) => {
  const [theme, setTheme] = React.useState(getInitialTheme);

  const rawSetTheme = (rawTheme: string) => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      const isDark = rawTheme === "dark";

      root.classList.remove(isDark ? "light" : "dark");
      root.classList.add(rawTheme);

      localStorage.setItem("color-theme", rawTheme);
    }
  };

  if (initialTheme) {
    rawSetTheme(initialTheme);
  }

  React.useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

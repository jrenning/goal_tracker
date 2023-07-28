import { Html, Head, Main, NextScript } from "next/document";
import { useContext, useEffect } from "react";
import { useLoaded } from "~/hooks/useLoaded";
import { ThemeContext } from "~/utils/theme";
export default function Document() {
  const { theme, setTheme } = useContext(ThemeContext);
  const loaded = useLoaded();

  return (
    <Html className="">
      <Head />

      <body>
        <div id="modal"></div>
        <Main />
      </body>
      <NextScript />
    </Html>
  );
}

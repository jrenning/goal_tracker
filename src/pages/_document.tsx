import { Html, Head, Main, NextScript } from "next/document";
import { useContext, useEffect } from "react";
import { useLoaded } from "~/hooks/useLoaded";
import { ThemeContext } from "~/utils/theme";
export default function Document() {
  const { theme, setTheme } = useContext(ThemeContext);
  const loaded = useLoaded();

  return (
    <Html className="">
      <Head>
        <link rel="manifest" href="/manifest.json"></link>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-startup-image" href="/icon-384x384.png" />
      </Head>

      <body>
        <div id="popup"></div>
        <div id="modal"></div>
        <Main />
      </body>
      <NextScript />
    </Html>
  );
}

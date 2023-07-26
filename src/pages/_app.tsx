import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { AnimatePresence } from "framer-motion";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { ThemeContext, ThemeProvider, getInitialTheme } from "~/utils/theme";
import { useContext, useEffect } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );
  const Initialtheme = getInitialTheme();

  // work around for dark mode, need to set it on initial render, can't do it with just css 
  useEffect(()=> {
    const root_list = document.documentElement.classList;
    if (Initialtheme == "dark") {
      root_list.add("bg-[#121212]");
    }
    else {
      root_list.add("bg-white");
    }
  }, [Initialtheme])

  return (
    <ThemeProvider initialTheme={Initialtheme}>
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Header name="Goal Tracker" />
        <div className="h-full w-full dark:bg-[#121212]">
          <Component {...pageProps} />
        </div>
        <Footer />
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);

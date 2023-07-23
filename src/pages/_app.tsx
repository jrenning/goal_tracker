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
  Filler
} from "chart.js";
import { AnimatePresence } from "framer-motion";
import Footer from "~/components/Footer";
import Header from "~/components/Header";



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
  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Header name="Goal Tracker" />
      <Component {...pageProps} />
      <Footer />
    </AnimatePresence>
  );
};

export default api.withTRPC(MyApp);

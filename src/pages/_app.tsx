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
} from "chart.js";



const MyApp: AppType = ({ Component, pageProps }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);

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
import Footer from "~/components/UI/Footer";
import Header from "~/components/UI/Header";
import { ThemeContext, ThemeProvider, getInitialTheme } from "~/utils/theme";
import { useContext, useEffect, useState, createContext } from "react";
import { colors } from "~/utils/colors";
import Modal, { ModalProps } from "~/components/Modals/Modal";
import PopupMessage, { PopupProps } from "~/components/Modals/PopupMessage";

export const ModalContext = createContext<
  React.Dispatch<React.SetStateAction<ModalProps>> | undefined
>(undefined);
export const PopupContext = createContext<
  React.Dispatch<React.SetStateAction<PopupProps>> | undefined
>(undefined);

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

  const [modal, setModal] = useState<ModalProps>({
    title: "",
    content: <div></div>,
    isOpen: false,
    backgroundColor: colors["Odd_Job"] ? colors["Odd_Job"] : "#ffffff",
  });

  const [popup, setPopup] = useState<PopupProps>({
    message: "",
    type: "Error",
    autoclose: true,
    isOpen: false,
    timeout: 2000,
  });

  // work around for dark mode, need to set it on initial render, can't do it with just css
  useEffect(() => {
    const root_list = document.documentElement.classList;
    if (Initialtheme == "dark") {
      root_list.add("bg-[#121212]");
    } else {
      root_list.add("bg-white");
    }
  }, [Initialtheme]);

  // set up modal

  return (
    <PopupContext.Provider value={setPopup}>
      <ModalContext.Provider value={setModal}>
        <ThemeProvider initialTheme={Initialtheme}>
          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <Modal
              title={modal?.title}
              content={modal.content}
              isOpen={modal.isOpen}
              backgroundColor={modal.backgroundColor}
            />
            <PopupMessage
              message={popup.message}
              type={popup.type}
              timeout={popup.timeout}
              autoclose={popup.autoclose}
              isOpen={popup.isOpen}
            />
            <Header name="Goal Tracker" />
            <div className="h-full w-full dark:bg-[#121212]">
              <Component {...pageProps} />
            </div>
            <Footer />
          </AnimatePresence>
        </ThemeProvider>
      </ModalContext.Provider>
    </PopupContext.Provider>
  );
};

export default api.withTRPC(MyApp);

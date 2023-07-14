import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ModalProps } from "~/components/Modal";
import { createContext } from "react";
const ModalContext = createContext<
  [(modal: ModalProps) => unknown, () => unknown]
>([() => console.log("Open modal"), () => console.log("Close modal")]);

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);

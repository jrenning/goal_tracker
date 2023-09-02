import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { PopupContext } from "~/pages/_app";
import { colors } from "~/utils/colors";


export type PopupMessageTypes = "Error" | "Success" | "Info"

export type PopupProps = {
  message: string;
  type: "Error" | "Success" | "Info";
  autoclose: boolean;
  timeout: number;
  isOpen: boolean;
};

function PopupMessage({
  message,
  type,
  autoclose,
  timeout,
  isOpen,
}: PopupProps) {
  const setPopup = useContext(PopupContext);

  const closeModal = () => {
    let updated_state = { isOpen: false };
    setPopup &&
      setPopup((popup) => ({
        ...popup,
        ...updated_state,
      }));
  };

  useEffect(() => {
    if (autoclose) {
      setTimeout(() => {
        closeModal();
      }, timeout);
    }
  }, [isOpen]);

  const color = colors[type];

  const popup = (
    <div
      className="fixed left-0 top-0 z-50 h-16 w-full shadow-lg p-2"
      style={{ backgroundColor: color ? color : "white" }}
    >
      <div className="flex flex-row justify-between">
        <div className="text-md font-semibold">{message}</div>
        <button className="text-xl font-extrabold absolute right-0 top-0 p-2" onClick={() => closeModal()}>
          X
        </button>
      </div>
    </div>
  );
  if (typeof window == "object") {
    const dom = document.querySelector("#popup");
    if (isOpen && dom && typeof window === "object") {
      return ReactDOM.createPortal(popup, dom);
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export default PopupMessage;

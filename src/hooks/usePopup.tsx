import React, { useContext } from "react";
import { PopupMessageTypes } from "~/components/Modals/PopupMessage";
import { PopupContext } from "~/pages/_app";

function usePopup() {
  const setPopup = useContext(PopupContext);

  const setErrorPopup = (message: string) => {
    const type: PopupMessageTypes = "Error";
    let updated_state = { isOpen: true, message: message, type: type };
    setPopup &&
      setPopup((popup) => ({
        ...popup,
        ...updated_state,
      }));
  };

  const setSuccessPopup = (message: string) => {
    const type: PopupMessageTypes = "Success";
    let updated_state = { isOpen: true, message: message, type: type };
    setPopup &&
      setPopup((popup) => ({
        ...popup,
        ...updated_state,
      }));
  };

  const setInfoPopup = (message: string) => {
    const type: PopupMessageTypes = "Info";
    let updated_state = {
      isOpen: true,
      message: message,
      type: type,
    };
    setPopup &&
      setPopup((popup) => ({
        ...popup,
        ...updated_state,
      }));
  };


  return {
    setErrorPopup: setErrorPopup,
    setSuccessPopup: setSuccessPopup,
    setInfoPopup: setInfoPopup
  }
}

export default usePopup;

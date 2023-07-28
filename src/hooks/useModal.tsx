import React, { useContext } from "react";
import LoginModal from "~/components/Modals/LoginModal";
import SubscriptionButton from "~/components/UI/SubscriptionButton";
import { ModalContext } from "~/pages/_app";

function useModal() {
  const setModal = useContext(ModalContext);

  const closeModal = () => {
    let updated_state = { isOpen: false };
    setModal &&
      setModal((modal) => ({
        ...modal,
        ...updated_state,
      }));
  };

  const loginModal = () => {
    let updated_state = {
      isOpen: true,
      title: "Login",
      content: <LoginModal />,
      backgroundColor: "#ADD8E6",
    };
    setModal &&
      setModal((modal) => ({
        ...modal,
        ...updated_state,
      }));
  };

  const subscriptionModal = () => {
    setModal &&
      setModal({
        title: "Subscribe to get Notifications",
        content: <SubscriptionButton />,
        isOpen: true,
        backgroundColor: "#ADD8E6",
      });
  };

  return {
    closeModal: closeModal,
    loginModal: loginModal,
    subscriptionModal: subscriptionModal
  };
}

export default useModal;

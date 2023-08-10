import React, { useContext } from "react";
import GoalModal, { GoalModalProps } from "~/components/Modals/GoalModal";
import LevelUp, { LevelUpProps } from "~/components/Modals/LevelUp";
import LoginModal from "~/components/Modals/LoginModal";
import SubscriptionButton from "~/components/UI/SubscriptionButton";
import { GoalCategories } from "~/pages";
import { ModalContext } from "~/pages/_app";
import { colors } from "~/utils/colors";

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

  const goalModal = ({id, category, name}: GoalModalProps) => {
    const color = colors[category]
    setModal &&
      setModal({
        title: name,
        content: (
          <GoalModal
            id={id}
            category={category}
            name={name}
          />
        ),
        isOpen: true,
        backgroundColor: color ? color : "#ADD8E6",
      });
    }


      interface LevelUpModalProps extends LevelUpProps {
        goal_category: GoalCategories
      }

    const levelUpModal = ({level, rewards, categories, goal_category}: LevelUpModalProps) => {
        const color = colors[goal_category];
        setModal &&
          setModal({
            title: "Congrats, you leveled up!",
            content: (
              <LevelUp
                level={level}
                rewards={rewards}
                categories={categories}
              />
            ),
            isOpen: true,
            backgroundColor: color ? color : "#ADD8E6",
            backlink: "/"
          });
    }

  return {
    closeModal: closeModal,
    loginModal: loginModal,
    subscriptionModal: subscriptionModal,
    goalModal: goalModal,
    levelUpModal: levelUpModal
  };
}

export default useModal;

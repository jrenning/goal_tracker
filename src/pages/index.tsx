"use client";

import Head from "next/head";
import { createContext, useEffect, useState } from "react";
import CompletedBox from "~/components/CompletedBox";
import GoalBox from "~/components/GoalBox";
import Header from "~/components/Header";
import NotificationButton from "~/components/NotificationButton";
import ProgressBar from "~/components/ProgressBar";
import SubscriptionButton from "~/components/SubscriptionButton";
import Title from "~/components/Title";
import { api } from "~/utils/api";

import React from "react";
import Modal, { ModalProps } from "~/components/Modal";
import { flushSync } from "react-dom";
import LevelUp from "~/components/LevelUp";
import { colors } from "~/utils/colors";
import { categories } from "~/server/api/routers/goals";
import ProgressBox from "~/components/ProgressBox";
import { z } from "zod";

export const ModalContext = createContext<
  React.Dispatch<React.SetStateAction<ModalProps>> | undefined
>(undefined);

export type GoalCategories = z.infer<typeof categories>

export default function Home() {
  const user = api.user.getCurrentUserInfo.useQuery();

  const [subscription, setSubscription] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (user.data?.subscription != null) {
      setSubscription(user.data.subscription);
      setIsSubscribed(true);
    }
    else {
      setModal({
        title: "Subscribe to get Notifications",
        content: <SubscriptionButton setSubscription={setSubscription}/>,
        isOpen: true,
        backgroundColor: "#ADD8E6"
      })

    }
  }, [setSubscription]);

  const [modal, setModal] = useState<ModalProps>({
    title: "",
    content: <div></div>,
    isOpen: false,
    backgroundColor: colors["Odd_Job"] ? colors["Odd_Job"] : "#ffffff"
  });

  const openModal = async () => {
    let updated_state = { isOpen: true };
    flushSync(() => {
      setModal((modal) => ({
        ...modal,
        ...updated_state,
      }));
    });

  };

  useEffect(()=> {
    console.log(modal)
  }, [modal])

  return (
    <>
      <ModalContext.Provider value={setModal}>
        <Head>
          <title>Goals Tracker</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json"></link>
        </Head>
        <Header name="Goal Tracker" />
        <Modal
          title={modal?.title}
          content={modal.content}
          isOpen={modal.isOpen}
          backgroundColor={modal.backgroundColor}
        />

        <ProgressBox />
        <div className="flex flex-col">

          <NotificationButton
            text="This is a test"
            subscription={subscription}
          />
        </div>

        <Title name="My Goals" date={true} />

        <GoalBox />
        <CompletedBox />
      </ModalContext.Provider>
    </>
  );
}

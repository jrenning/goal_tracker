"use client";

import Head from "next/head";
import { createContext, useEffect, useState } from "react";
import CompletedBox from "~/components/CompletedBox";
import GoalBox from "~/components/GoalBox";
import Header from "~/components/Header";
import NotificationButton from "~/components/NotificationButton";
import SubscriptionButton from "~/components/SubscriptionButton";
import Title from "~/components/Title";
import { api } from "~/utils/api";

import React from "react";
import Modal, { ModalProps } from "~/components/Modal";
import { colors } from "~/utils/colors";
import {
  days_of_week,
  goal_categories,
  repeat_type,
} from "~/server/api/routers/goals";
import ProgressBox from "~/components/ProgressBox";
import { z } from "zod";
import { reward_categories } from "~/server/api/routers/rewards";
import Footer from "~/components/Footer";
import { updateRepeatingGoals } from "~/utils/update";
import AddContentButton from "~/components/AddContentButton";
import { isMobile } from "~/utils/device";
import TransitionLayout from "~/components/PageTransitionLayout";
import PageTransitionLayout from "~/components/PageTransitionLayout";

export const ModalContext = createContext<
  React.Dispatch<React.SetStateAction<ModalProps>> | undefined
>(undefined);

export type GoalCategories = z.infer<typeof goal_categories>;
export type RewardCategories = z.infer<typeof reward_categories>;
export type DaysOfWeek = z.infer<typeof days_of_week>;
export type RepeatType = z.infer<typeof repeat_type>;

export default function Home() {
  const user = api.user.getCurrentUserInfo.useQuery();

  const [subscription, setSubscription] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (user.data?.subscription != null && isMobile()) {
      setSubscription(user.data.subscription);
      setIsSubscribed(true);
    } else {
      // only show on mobile for now
      if (isMobile()) {
        // yes this does try every time if the person isn't subscribed, annoying. but only me using it so...
        setModal({
          title: "Subscribe to get Notifications",
          content: <SubscriptionButton setSubscription={setSubscription} />,
          isOpen: true,
          backgroundColor: "#ADD8E6",
        });
      }
    }
  }, [setSubscription]);

  const [modal, setModal] = useState<ModalProps>({
    title: "",
    content: <div></div>,
    isOpen: false,
    backgroundColor: colors["Odd_Job"] ? colors["Odd_Job"] : "#ffffff",
  });

  return (
    <>
      <PageTransitionLayout>
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
          {/* <div className="flex flex-col">
            <NotificationButton
              text="This is a test"
              subscription={subscription}
            />
          </div> */}

          <Title name="My Goals" date={true} />

          <GoalBox />
          <CompletedBox />
          <AddContentButton />
          <Footer />
        </ModalContext.Provider>
      </PageTransitionLayout>
    </>
  );
}

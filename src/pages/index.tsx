import Head from "next/head";
import { createContext, useContext, useEffect, useState } from "react";
import GoalBox from "~/components/Goals/GoalBox";
import NotificationButton from "~/components/UI/NotificationButton";
import SubscriptionButton from "~/components/UI/SubscriptionButton";
import Title from "~/components/UI/Title";
import { api } from "~/utils/api";

import React from "react";
import Modal, { ModalProps } from "~/components/Modals/Modal";
import { colors } from "~/utils/colors";
import {
  days_of_week,
  goal_categories,
  repeat_type,
} from "~/server/api/routers/goals";
import ProgressBox from "~/components/Progress/ProgressBox";
import { z } from "zod";
import { reward_categories } from "~/server/api/routers/rewards";
import AddContentButton from "~/components/AddContent/AddContentButton";
import { isMobile } from "~/utils/device";
import PageTransitionLayout from "~/components/Transitions/PageTransitionLayout";
import { GetServerSideProps } from "next";
import { updateRepeatingGoals } from "~/utils/update";
import ResetStatsButton from "~/components/UI/ResetStatsButton";
import { ThemeContext } from "~/utils/theme";

export const ModalContext = createContext<
  React.Dispatch<React.SetStateAction<ModalProps>> | undefined
>(undefined);

export type GoalCategories = z.infer<typeof goal_categories>;
export type RewardCategories = z.infer<typeof reward_categories>;
export type DaysOfWeek = z.infer<typeof days_of_week>;
export type RepeatType = z.infer<typeof repeat_type>;

export default function Home() {
  const { data, isLoading } = api.user.getCurrentUserInfo.useQuery();
  const subscription_data = data?.subscription;
  const { theme, setTheme } = useContext(ThemeContext);

  const [subscription, setSubscription] = useState<any>(null);

  const repeats = api.goals.getCurrentGoals.useQuery().data;

  useEffect(() => {
    if (subscription_data != null && isMobile()) {
      setSubscription(subscription_data);
    } else {
      // only show on mobile for now
      if (isMobile() && !isLoading) {
        // yes this does try every time if the person isn't subscribed, annoying. but only me using it so...
        setModal({
          title: "Subscribe to get Notifications",
          content: <SubscriptionButton setSubscription={setSubscription} />,
          isOpen: true,
          backgroundColor: "#ADD8E6",
        });
      }
    }
  }, [subscription_data]);

  const [modal, setModal] = useState<ModalProps>({
    title: "",
    content: <div></div>,
    isOpen: false,
    backgroundColor: colors["Odd_Job"] ? colors["Odd_Job"] : "#ffffff",
  });

  return (
    <div className="darK:bg-[#121212]">
      <PageTransitionLayout>
        <ModalContext.Provider value={setModal}>
          <Head>
            <title>Goals Tracker</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json"></link>
          </Head>
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

          <GoalBox disabled={false} />

          <AddContentButton />
        </ModalContext.Provider>
      </PageTransitionLayout>
    </div>
  );
}

export const getStaticProps: GetServerSideProps = async () => {
  const result = await updateRepeatingGoals();
  console.log(result);
  const DAY_IN_SECONDS = 60 * 60 * 24;
  return { props: {}, revalidate: DAY_IN_SECONDS };
};

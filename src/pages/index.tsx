import Head from "next/head";
import { useEffect } from "react";
import GoalBox from "~/components/Goals/GoalBox";
import Title from "~/components/UI/Title";
import { api } from "~/utils/api";

import React from "react";
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
import usePopup from "~/hooks/usePopup";
import { useRouter } from "next/router";
import useModal from "~/hooks/useModal";

export type GoalCategories = z.infer<typeof goal_categories>;
export type RewardCategories = z.infer<typeof reward_categories>;
export type DaysOfWeek = z.infer<typeof days_of_week>;
export type RepeatType = z.infer<typeof repeat_type>;

export default function Home() {
  const { data, isLoading } = api.user.getCurrentUserInfo.useQuery();
  const subscription_data = data?.subscription;
  const {subscriptionModal} = useModal()

  const router = useRouter()


  useEffect(() => {
    // only show on mobile for now
    if (isMobile() && subscription_data == null && !isLoading) {
      // yes this does try every time if the person isn't subscribed, annoying. but only me using it so...
      subscriptionModal()
    }
  }, [subscription_data]);




  return (
    <div className="darK:bg-[#121212]">
      <PageTransitionLayout>
        <Head>
          <title>Goals Tracker</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json"></link>
        </Head>

        <button onClick={()=> router.push("/login")}>Click Me</button>

        <ProgressBox />

        <Title name="My Goals" date={true} />

        <GoalBox disabled={false} />

        <AddContentButton />
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

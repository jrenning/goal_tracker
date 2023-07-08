import Head from "next/head";
import { useEffect, useState } from "react";
import CompletedBox from "~/components/CompletedBox";
import GoalBox from "~/components/GoalBox";
import Header from "~/components/Header";
import NotificationButton from "~/components/NotificationButton";
import ProgressBar from "~/components/ProgressBar";
import SubscriptionButton from "~/components/SubscriptionButton";
import Title from "~/components/Title";

export default function Home() {

  const [subscription, setSubscription] = useState(null)

  return (
    <>
      <Head>
        <title>Goals Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json"></link>
      </Head>
      <Header name="Goal Tracker" />
      <ProgressBar />
      <div className="flex flex-col">
        <SubscriptionButton setSubscription={setSubscription}/>
        <NotificationButton text="This is a test" subscription={subscription}/>
      </div>

      <Title name="My Goals" date={true} />
      <GoalBox />
      <CompletedBox />
    </>
  );
}

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

  useEffect(()=> {
    async function periodic() {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready
        if ("periodicSync" in reg) {
          //@ts-ignore
          const status = await navigator.permissions.query({name: "periodic-background-sync"})
          if (status.state == "granted") {
            try {
            //@ts-ignore
            await reg.periodicSync.register("reminder", {
              minInterval: 60*60*1000 // every hour
            })
          } catch(e) {
            console.error("Can't do background sync")
          }
          }
        }
      }
    }
  }, [])

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

import Head from "next/head";
import { useEffect, useState } from "react";
import CompletedBox from "~/components/CompletedBox";
import GoalBox from "~/components/GoalBox";
import Header from "~/components/Header";
import NotificationButton from "~/components/NotificationButton";
import ProgressBar from "~/components/ProgressBar";
import SubscriptionButton from "~/components/SubscriptionButton";
import Title from "~/components/Title";
import { api } from "~/utils/api";

export default function Home() {
  const user = api.user.getCurrentUserInfo.useQuery();

  const [subscription, setSubscription] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(()=> {
      if (user.data?.subscription != null) {
        console.log(user.data)
        setSubscription(user.data.subscription);
        setIsSubscribed(true);
      }
  }, [])


  useEffect(() => {
    async function periodic() {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if ("periodicSync" in reg) {
          
          const status = await navigator.permissions.query({
            //@ts-ignore
            name: "periodic-background-sync",
          });
          if (status.state == "granted") {
            try {
              //@ts-ignore
              await reg.periodicSync.register("reminder", {
                minInterval: 60 * 60 * 1000, // every hour
              });
            } catch (e) {
              console.error("Can't do background sync");
            }
          }
        }
      }
    }
    periodic();
  }, []);

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
        {!isSubscribed ? (
          <SubscriptionButton setSubscription={setSubscription} />
        ) : (
          ""
        )}

        <NotificationButton text="This is a test" subscription={subscription} />
      </div>

      <Title name="My Goals" date={true} />
      <GoalBox />
      <CompletedBox />
    </>
  );
}

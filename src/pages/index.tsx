'use client'


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
import useModal from "~/hooks/useModal";
import Modal, { ModalProps } from "~/components/Modal";






export default function Home() {
  const user = api.user.getCurrentUserInfo.useQuery();

  const [subscription, setSubscription] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (user.data?.subscription != null) {
      console.log(user.data);
      setSubscription(user.data.subscription);
      setIsSubscribed(true);
    }
  }, [setSubscription]);
  const [active, setActive] = useState(false)

  // work around for stupid hydration error 
  useEffect(()=>{
    setActive(true)
  }, [])

  return (
    <>
      <Head>
        <title>Goals Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json"></link>
      </Head>
      <Header name="Goal Tracker" />
      {active ? <Modal title="Test" content={<div></div>} isOpen={true} /> : ""}
      
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

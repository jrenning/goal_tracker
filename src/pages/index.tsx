import Head from "next/head";
import { useEffect, useState } from "react";
import CompletedBox from "~/components/CompletedBox";
import GoalBox from "~/components/GoalBox";
import Header from "~/components/Header";
import NotificationButton from "~/components/NotificationButton";
import ProgressBar from "~/components/ProgressBar";
import Title from "~/components/Title";

export default function Home() {

  useEffect(()=> {
    askPermission()
  }, [])

  function askPermission() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== "granted") {
        throw new Error("We weren't granted permission.");
      }
    });
  }

  return (
    <>
      <Head>
        <title>Goals Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json"></link>
      </Head>
      <Header name="Goal Tracker" />
      <ProgressBar />
      <NotificationButton text="This is a test" />
      <Title name="My Goals" date={true} />
      <GoalBox />
      <CompletedBox />
    </>
  );
}

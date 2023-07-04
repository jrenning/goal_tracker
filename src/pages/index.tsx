import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import CompletedBox from "~/components/CompletedBox";
import GoalBox from "~/components/GoalBox";
import Header from "~/components/Header";
import ProgressBar from "~/components/ProgressBar";
import Title from "~/components/Title";


export default function Home() {




  return (
    <>
      <Head>
        <title>Goals Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json"></link>
      </Head>
      <Header name="Goal Tracker" />
      <ProgressBar />
      <Title name="My Goals" date={true} />
      <GoalBox />
      <CompletedBox />
    </>
  );
}
import React, { useState } from "react";
import CompletedBox from "~/components/Goals/CompletedBox";
import PageSelection from "~/components/UI/PageSelection";
import PageTransitionLayout from "~/components/Transitions/PageTransitionLayout";
import ProgressPage from "~/components/Charts/ProgressPage";
import RewardBox from "~/components/Rewards/RewardBox";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export type HistoryPages = "Completed" | "Rewards" | "Progress";

function history() {
  const [activePage, setActivePage] = useState<HistoryPages>("Completed");
  const names: HistoryPages[] = ["Completed", "Rewards", "Progress"];
  return (
    <PageTransitionLayout keyName="history">
      <PageSelection
        names={names}
        setActive={setActivePage}
        active={activePage}
      />
      {activePage == "Completed" && <CompletedBox />}
      {activePage == "Progress" && <ProgressPage />}
      {activePage == "Rewards" && <RewardBox />}
    </PageTransitionLayout>
  );
}

export default history;

//@ts-ignore
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
}

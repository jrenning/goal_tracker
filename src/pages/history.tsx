import React, { useState } from "react";
import CompletedBox from "~/components/Goals/CompletedBox";
import PageSelection from "~/components/UI/PageSelection";
import PageTransitionLayout from "~/components/Transitions/PageTransitionLayout";
import ProgressPage from "~/components/Charts/ProgressPage";
import RewardBox from "~/components/Rewards/RewardBox";

export type HistoryPages = "Completed" | "Rewards" | "Progress";

function history() {
  const [activePage, setActivePage] = useState<HistoryPages>("Completed");
  const names: HistoryPages[] = ["Completed", "Rewards", "Progress"];
  return (
    <PageTransitionLayout>
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

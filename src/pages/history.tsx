import React, { useState } from 'react'
import CompletedBox from '~/components/CompletedBox';
import PageSelection from '~/components/PageSelection';
import PageTransitionLayout from '~/components/PageTransitionLayout'
import ProgressPage from '~/components/ProgressPage';
import RewardBox from '~/components/RewardBox';

export type HistoryPages = "Completed" | "Rewards" | "Progress";

function history() {

    

const [activePage, setActivePage] = useState<HistoryPages>("Completed")
const names: HistoryPages[] = ["Completed", "Rewards", "Progress"]
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

export default history
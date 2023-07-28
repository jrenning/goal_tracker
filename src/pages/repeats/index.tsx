import React from "react";
import Calender from "~/components/Calender/Calender";
import PageTransitionLayout from "~/components/Transitions/PageTransitionLayout";

function repeats() {
  return (
    <PageTransitionLayout>
      <Calender />
    </PageTransitionLayout>
  );
}

export default repeats;

import { getServerSession } from "next-auth";
import React from "react";
import Calender from "~/components/Calender/Calender";
import PageTransitionLayout from "~/components/Transitions/PageTransitionLayout";
import { authOptions } from "../api/auth/[...nextauth]";

function repeats() {
  return (
    <PageTransitionLayout keyName="repeats">
      <Calender />
    </PageTransitionLayout>
  );
}

export default repeats;

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
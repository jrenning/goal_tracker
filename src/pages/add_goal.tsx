import React, { useState } from "react";
import GoalForm from "~/components/Goals/GoalForm";
import PopupTransitionLayout from "~/components/Transitions/PopupTransitionLayout";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

function add_goal() {
  return (
    <PopupTransitionLayout keyName="add_goal">
      <div className="h-screen w-screen bg-green-50">
        <GoalForm backlink="/" />
      </div>
    </PopupTransitionLayout>
  );
}

export default add_goal;

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
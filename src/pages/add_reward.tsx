import React from "react";
import PopupTransitionLayout from "~/components/Transitions/PopupTransitionLayout";
import RewardForm from "~/components/Rewards/RewardForm";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

function add_reward() {
  return (
    <PopupTransitionLayout keyName="add_reward">
      <div className="h-full w-screen bg-green-50">
        <RewardForm backlink="/" />
      </div>
    </PopupTransitionLayout>
  );
}

export default add_reward;

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
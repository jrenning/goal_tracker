import Head from "next/head";
import { useEffect } from "react";
import GoalBox from "~/components/Goals/GoalBox";
import Title from "~/components/UI/Title";
import { api } from "~/utils/api";

import React from "react";
import {
  days_of_week,
  goal_categories,
  repeat_type,
} from "~/server/api/routers/goals";
import ProgressBox from "~/components/Progress/ProgressBox";
import { z } from "zod";
import { reward_categories } from "~/server/api/routers/rewards";
import AddContentButton from "~/components/AddContent/AddContentButton";
import { isMobile } from "~/utils/device";
import PageTransitionLayout from "~/components/Transitions/PageTransitionLayout";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { updateRepeatingGoals } from "~/utils/update";
import usePopup from "~/hooks/usePopup";
import { useRouter } from "next/router";
import useModal from "~/hooks/useModal";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Session } from "next-auth";

export type GoalCategories = z.infer<typeof goal_categories>;
export type RewardCategories = z.infer<typeof reward_categories>;
export type DaysOfWeek = z.infer<typeof days_of_week>;
export type RepeatType = z.infer<typeof repeat_type>;

export default function Home() {
  const { data: session, status } = useSession();

  const { subscriptionModal } = useModal();

  const router = useRouter();

  if (status == "loading") {
    return <div>Loading...</div>;
  }

  if (status == "unauthenticated") {
    return <div className="absolute top-[50%] left-[50%]">Not Allowed, please sign in</div>;
  }

  const { data, isLoading } = api.user.getCurrentUserInfo.useQuery();
  const subscription_data = data?.subscription;



  useEffect(() => {
    // only show on mobile for now
    if (isMobile() && subscription_data == null && !isLoading) {
      // yes this does try every time if the person isn't subscribed, annoying. but only me using it so...
      subscriptionModal();
    }
  }, [subscription_data]);

  return (
    <div className="darK:bg-[#121212]">
      <PageTransitionLayout keyName="home">
        <Head>

        </Head>
        <ProgressBox />
        <Title name="My Goals" date={true} />
        <GoalBox disabled={false} />
        <AddContentButton />
      </PageTransitionLayout>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps<{
//   session: Session | null
// }> = async (context) => {
//   return {
//     props: {
//       session: await getServerSession(
//         context.req,
//         context.res,
//         authOptions
//       )
//     }
//   }
// }

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

  // add repeating goals 
  await updateRepeatingGoals(session)

  return {
    props: {
      session
    }
  }
}

// export const getStaticProps: GetServerSideProps = async () => {
//   const result = await updateRepeatingGoals();
//   console.log(result);
//   const DAY_IN_SECONDS = 60 * 60 * 24;
//   return { props: {}, revalidate: DAY_IN_SECONDS };
// };

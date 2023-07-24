import { NextApiRequest, NextApiResponse } from "next";
import ResetStatsButton from "~/components/ResetStatsButton";
import { appRouter } from "~/server/api/root";
import { UserSubscription } from "~/server/api/routers/user";
import { prisma } from "~/server/db";


type UserSubscriptionParsed = {
  endpoint: string | null,
  keys: {
    p256dh: string | null,
    auth: string | null
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const sendNotification = async (subscription: UserSubscriptionParsed) => {
    if (subscription == null) {
      throw new Error("The subscription was null");
    }



    const result = await fetch("http://localhost:3000/api/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    res.send(result)




    return result
  };



  // get the subscription data

  const caller = await appRouter.createCaller({
    prisma: prisma,
  });




  const result = await caller.user.getUserSubscription()




  // send notification request
//   await sendNotification(result?.subscription)
//     .then((response) => res.send({ message: "Success!" }))
//     .catch((err) => {
//       res.write({ message: "Failed", result: result, err: err });
//     });
    const send = await sendNotification(result)
};

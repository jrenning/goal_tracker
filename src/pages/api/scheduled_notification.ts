import { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const sendNotification = async (subscription: any) => {
    if (subscription == null) {
      throw new Error("The subscription was null");
    }
    const result = await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: subscription,
    });
    alert(result.body);
    alert(result.statusText);

    return result
  };

  // get the subscription data

  const caller = appRouter.createCaller({
    prisma: prisma,
  });
  const result = await caller.user.getCurrentUserInfo();

  // send notification request
//   await sendNotification(result?.subscription)
//     .then((response) => res.send({ message: "Success!" }))
//     .catch((err) => {
//       res.write({ message: "Failed", result: result, err: err });
//     });
    const send = await sendNotification(result?.subscription)

    res.send(send)
};

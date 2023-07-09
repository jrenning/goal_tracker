import { NextApiRequest, NextApiResponse } from "next";
import { appRouter} from "~/server/api/root";
import { prisma } from "~/server/db";

export default async (req: NextApiRequest, 
    res: NextApiResponse) => {

        const sendNotification = async (subscription: any) => {
          if (subscription == null) {
            return;
          }
          const result = await fetch("/api/notification", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ subscription }),
          });
          alert(result.body);
          alert(result.statusText);
        };

        // get the subscription data 

        const caller = appRouter.createCaller({
            prisma: prisma
        });
        const result = await caller.user.getCurrentUserInfo();


        // send notification request 
        await sendNotification(result?.subscription).then(() => res.send({message: "Success!"})).catch((err) => res.send({message: "Failed", result: result, err: err}))



    }




import { NextApiRequest, NextApiResponse } from "next";

import webPush from "web-push"


  webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL }`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ? process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY : "",
    process.env.WEB_PUSH_PRIVATE_KEY ? process.env.WEB_PUSH_PRIVATE_KEY : ""
  );


export default async function (req: NextApiRequest, res: NextApiResponse) {

  if (req.method == "POST") {
    const { subscription } = req.body;

    webPush
      .sendNotification(
        subscription,
        JSON.stringify({
          title: "Hey Jack!",
          message: "How are your goals going today?",
        }),

      )
      .then((response: any) => {
       res.writeHead(response.statusCode, response.headers).end(response.body);
      })
      .catch((err: any) => {
        if ("statusCode" in err) {
          res.writeHead(err.statusCode, err.headers).end(err.body);
        } else {
          res.send("Hello");
          res.statusCode = 500;
          
          res.end();
        }
      });
  } else {
    res.statusCode = 405;
    res.end();
  }
};


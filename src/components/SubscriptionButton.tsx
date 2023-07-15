import React from "react";
import { api } from "~/utils/api";

type Props = {
  setSubscription: any;
};

function SubscriptionButton({ setSubscription }: Props) {
  const base64ToUint8Array = (base64: string) => {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(b64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const utils = api.useContext();

  const subscribe_call = api.user.saveSubscription.useMutation({
    async onSuccess(data) {
      console.log("Subscription was added");
      await utils.user.invalidate();
    },
  });

  const Subscribe = async () => {
    const status = await Notification.requestPermission();
    if (status == "granted") {
      const notif = new Notification("Hey Jack!");
      const options = {
        userVisibleOnly: true,
        //@ts-ignore
        applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY),
      };
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager
          .subscribe(options)
          .then((pushSubscription) => {
            subscribe_call.mutate({
              json: JSON.stringify({ pushSubscription }),
            });
            setSubscription(pushSubscription);
          })
          .catch((err) => {
            console.error(err);
            alert(err);
          });
      });
    } else {
      console.error("Permission was weird");
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
    <button
      onClick={() => Subscribe()}
      className="w-[50%] h-16 text-4xl font-semibold mb-2 rounded-md bg-blue-300 hover:bg-blue-100"
    >
      Subscribe
    </button>
    </div>
  );
}

export default SubscriptionButton;

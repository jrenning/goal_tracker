import React, { useContext } from "react";
import { ModalContext } from "~/pages";
import { api } from "~/utils/api";

type Props = {
  setSubscription: any;
};

function SubscriptionButton({ setSubscription }: Props) {
  const setModal = useContext(ModalContext);

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
        applicationServerKey: base64ToUint8Array(
          //@ts-ignore
          process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
        ),
      };
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager
          .subscribe(options)
          .then((pushSubscription) => {
            subscribe_call.mutate({
              json: JSON.stringify({ pushSubscription }),
            });
            setSubscription(pushSubscription);
            
            setModal &&
              setModal((modal) => ({
                ...modal,
                ...updated_state,
              }));
          })
          .catch((err) => {
            console.error(err);
            alert(err);
          });
      });
    } else {
      console.error("Permission was weird");
    }
    // close modal after subscribe button is hit regardless of answer 
    let updated_state = { isOpen: false };
    setModal &&
      setModal((modal) => ({
        ...modal,
        ...updated_state,
      }));
  };

  return (
    <div className="mt-20 flex items-center justify-center">
      <button
        onClick={() => Subscribe()}
        className="mb-2 h-16 w-[50%] rounded-md bg-blue-300 text-4xl font-semibold hover:bg-blue-100"
      >
        Subscribe
      </button>
    </div>
  );
}

export default SubscriptionButton;

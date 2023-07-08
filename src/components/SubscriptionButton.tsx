import React from "react";

function SubscriptionButton() {
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

  const Subscribe = async () => {
    const status = await Notification.requestPermission();
    console.log(`The status is ${status}`);
    if (status == "granted") {
      const notif = new Notification("Hey Jack!");
      const options = {
        userVisibleOnly: true,
        //@ts-ignore
        applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY)
      };
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager
          .subscribe(options)
          .then((pushSubscription) => {
            console.log(pushSubscription);
            alert(pushSubscription);
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
    <button
      onClick={() => Subscribe()}
      className="mx-[200px] mb-2 rounded-md bg-blue-300 hover:bg-blue-100"
    >
      Subscribe
    </button>
  );
}

export default SubscriptionButton;

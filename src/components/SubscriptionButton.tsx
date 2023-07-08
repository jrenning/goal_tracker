import React from "react";

function SubscriptionButton() {
  const Subscribe = async () => {
    const status = await Notification.requestPermission();
    console.log(`The status is ${status}`);
    if (status == "granted") {
      const notif = new Notification("Hey Jack!");
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager
          .subscribe()
          .then((pushSubscription) => {
            console.log(pushSubscription);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    } else {
      console.error("Permission was weird");
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager
          .subscribe()
          .then((pushSubscription) => {
            console.log(pushSubscription);
          })
          .catch((err) => {
            console.error(err);
          });
      });
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

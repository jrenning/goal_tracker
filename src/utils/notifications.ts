

export async function updateBadgeNumber(number: number) {

  Notification.requestPermission().then((res) => {
    if (navigator.setAppBadge) {
      navigator.setAppBadge(number);
    }
  });
}

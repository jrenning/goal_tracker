import React from 'react'

type Props = {
    text: string
}

function NotificationButton({text}: Props) {

const sendNotification = (text: string) => {
    const notification = new Notification("New notification", {body: text})
}

  return (
    <button onClick={()=> sendNotification(text)}>Send Notification</button>
  )
}

export default NotificationButton
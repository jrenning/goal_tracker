import React from 'react'

type Props = {
    text: string
    subscription: any
}

function NotificationButton({text, subscription}: Props) {

const sendNotification = async () => {
    if (subscription == null) {
      return 
    }
    const result = await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({subscription})
    })
}

  return (
    <button onClick={()=> sendNotification()} className='rounded-md bg-red-300 mx-[200px] hover:bg-red-100'>Send Notification</button>
  )
}

export default NotificationButton
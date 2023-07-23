import React from 'react'
import { api } from '~/utils/api'

type Props = {
    text: string
}

function NotificationButton({text}: Props) {

const subscription = api.user.getCurrentUserInfo.useQuery().data?.subscription

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
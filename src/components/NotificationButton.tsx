import React from 'react'

type Props = {
    text: string
}

function NotificationButton({text}: Props) {

const sendNotification = (text: string) => {
    const notification = new Notification("New notification", {body: text})
}

  return (
    <button onClick={()=> sendNotification(text)} className='rounded-md bg-red-300 mx-[200px] hover:bg-red-100'>Send Notification</button>
  )
}

export default NotificationButton
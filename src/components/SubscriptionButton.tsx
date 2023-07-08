import React from 'react'

function SubscriptionButton() {

const Subscribe = async () => {
    const status = await Notification.requestPermission()

    if (status == "granted") {
        const notif = new Notification("Hey Jack!")
    }
    else {
        console.error("Permission wasn't granted")
    }


    // navigator.serviceWorker.ready.then(reg => {
    //     reg.pushManager.subscribe().then((pushSubscription)=> {
    //         console.log(pushSubscription)
    //     }).catch((err)=> {
    //         console.error(err)
    //     })
    // })
}

  return (
    <button onClick={()=> Subscribe()} className='rounded-md bg-blue-300 mb-2 mx-[200px] hover:bg-blue-100'>Subscribe</button>
  )
}

export default SubscriptionButton
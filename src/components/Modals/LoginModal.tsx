import { signIn } from 'next-auth/react'
import React from 'react'

function LoginModal() {

const loginUser = async () => {
    // TODO add stuff here
    signIn(undefined, {callbackUrl: "/"})


}


  return (
    <div className='flex flex-col justify-center items-center space-y-8 mt-12'>
        <h1 className='font-semibold'>Please sign in to access Goal Tracker</h1>
        <button className='flex justify-center items-center rounded-md px-4 py-2 bg-blue-400 text-white' onClick={()=> loginUser()}>Sign in</button>
    </div>
  )
}

export default LoginModal
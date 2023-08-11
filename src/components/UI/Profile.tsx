import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React from 'react'

function Profile() {
    const {data} = useSession()
    const router = useRouter()
  return (
    <button className=" flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white"
    onClick={()=> router.push("/profile")}>
      {data?.user?.email?.charAt(0).toUpperCase()}
    </button>
  );
}

export default Profile
import { useSession } from 'next-auth/react'
import React from 'react'

function Profile() {
    const {data} = useSession()
  return (
    <div className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white">
      {data?.user?.email?.charAt(0).toUpperCase()}
    </div>
  );
}

export default Profile
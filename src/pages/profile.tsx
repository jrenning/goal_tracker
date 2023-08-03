import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]';

function profile() {
    const {data} = useSession()


  return (
    <div className="flex flex-col">
      <div className="flex h-16 w-16 items-center justify-center rounded-full shadow-md">
        {data?.user?.email?.charAt(0).toUpperCase()}
      </div>
      <h1 className="flex items-center justify-center text-3xl font-semibold">
        {data?.user?.name}
      </h1>
      <div className="grid grid-cols-2">
        <div>Account created: </div>
        <div>Goals completed: </div>
        <div>Levels gained: </div>
        <div>Best category: </div>
        <div>Fastest growing category: </div>
      </div>
    </div>
  );
}

export default profile

//@ts-ignore
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
}
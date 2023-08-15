import { getServerSession } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]';
import { api } from '~/utils/api';

function profile() {
    const {data} = useSession()

    const info = api.user.getUserProfileInfo.useQuery().data


  return (
    <div className="mx-4 flex flex-col items-center justify-center rounded-md bg-gray-100 p-4 pb-12 shadow-lg">
        <div className='flex flex-row relative w-full justify-center items-center'>
      <div className="flex h-16 w-16 items-center justify-center rounded-full shadow-md">
        {data?.user?.email?.charAt(0).toUpperCase()}
      </div>
      <button className='rounded-md bg-red-300 absolute right-4 p-1 shadow-md flex justify-center items-center text-semibold'
      onClick={()=> signOut()}>
        Sign Out
      </button>
      </div>
      <h1 className="flex items-center justify-center text-3xl font-semibold">
        {data?.user?.name}
      </h1>
      <div>{data?.user?.email}</div>
      <div className="mt-4 grid w-full md:grid-cols-2 gap-4 font-semibold">
        <div>Account created: {info?.account_created?.toDateString()}</div>
        <div>Goals completed: {info?.goals_completed}</div>
        <div>Goals created: {info?.goals_created}</div>
        <div>Points gained: {info?.points_gained.total_points}</div>
        <div>Best category: {info?.best_category?.category}</div>
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
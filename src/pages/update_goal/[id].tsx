import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router'
import React from 'react'
import GoalForm from '~/components/Goals/GoalForm';
import PopupTransitionLayout from '~/components/Transitions/PopupTransitionLayout';
import { authOptions } from '../api/auth/[...nextauth]';

function update_goal() {
    const router = useRouter()
    //@ts-ignore
    const router_data: string = router.query.id as string ? router.query.id : ""

    if (!router_data) {
        return <div>Goal could not be found, please try again...</div>;
    }


  return (
    <PopupTransitionLayout keyName="update_goal">
      <div className="h-full w-screen bg-green-50">
        <GoalForm backlink="/" id={Number(router_data)}/>
      </div>
    </PopupTransitionLayout>
  )
}

export default update_goal

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
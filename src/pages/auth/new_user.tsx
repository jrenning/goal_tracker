import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { api } from '~/utils/api'

function new_user() {

    const setup_call = api.user.addUser.useMutation()
    const router = useRouter()

    const isNew = api.user.checkIfNewUser.useQuery().data

    useEffect(()=> {
        async function handleSetup() {
            if (isNew) {
                await setup_call.mutateAsync()
            }
        }
        handleSetup()
    }, [isNew])



  return (
    <div className='flex flex-col justify-center items-center mt-12 space-y-10'>
        <h1 className='font-bold text-2xl dark:text-white'>Welcome to Goal Tracker</h1>

        <div className="grid grid-cols-1 space-y-4 mx-4">
            <FeatureCard name="Add goals" description="Add goals with a variety of options including repeating them on a schedule and adding subitems to each to keep track of the progress" />
            <FeatureCard name="Track your progress" description="Track your progress in five different areas: Physical, Social, Education, Hobby, and Career, categories made to represent a hierarchy of your daily tasks!" />
            <FeatureCard name="Set rewards" description="Add rewards for each level that you gain in the five categories" />
        </div>

        <button className='rounded-md bg-green-300 px-2 py-1  text-lg font-semibold dark:text-white' onClick={()=> router.push("/")}>Get started</button>


    </div>
  )
}


type FeatureCardProps = {
    name: string,
    description: string
    image?: string
}

function FeatureCard({name, description, image}: FeatureCardProps) {
    return (
        <div className='bg-slate-200 rounded-md shadow-md p-2'>
            <div className='text-xl font-semibold flex justify-center items-center mb-6'>{name}</div>
            <div>{description}</div>

        </div>
    )
}

export default new_user
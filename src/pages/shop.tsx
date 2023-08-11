import React from 'react'
import ShopGrid from '~/components/Shop/ShopGrid'

function shop() {
  return (
    <div className='flex justify-center items-center flex-col'>
    <h1 className='font-semibold text-3xl mt-4'>Welcome to the Shop!</h1>
    

    <ShopGrid />


    </div>
  )
}

export default shop
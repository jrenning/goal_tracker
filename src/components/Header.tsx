import React from 'react'

type Props = {
    name: string
}


function Header({name}: Props) {
  return (
    <div className='items-center p-2 font-bold text-center h-12 text-white bg-green-400 shadow-md text-bold w-100vw'>{name}</div>
  )
}

export default Header
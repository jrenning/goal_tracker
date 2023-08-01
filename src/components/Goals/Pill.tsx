import React from 'react'

type PillProps = {
    name: string
    backgroundColor: string
}

function Pill({name, backgroundColor}: PillProps) {
  return (
    <div className='rounded-md flex justify-center items-center shadow-md h-8 w-fit font-semibold text-xs px-2' style={{backgroundColor: backgroundColor}}>
        {name}
    </div>
  )
}

export default Pill
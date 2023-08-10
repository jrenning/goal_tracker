import React, { ReactNode } from 'react'

type PillProps = {
    children: ReactNode
    backgroundColor: string
}

function Pill({children, backgroundColor}: PillProps) {
  return (
    <div className='rounded-md flex justify-center items-center shadow-md h-8 w-fit font-semibold text-xs px-2' style={{backgroundColor: backgroundColor}}>
        {children}
    </div>
  )
}

export default Pill
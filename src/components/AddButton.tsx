import Link from 'next/link';
import React from 'react'

type AddButtonProps = {
    name: string
    link: string
}

function AddButton({name, link}: AddButtonProps) {
  return (
    <div className="flex flex-row space-x-2">
      <div className="fixed right-20 flex w-[100px] flex-wrap rounded-md bg-slate-400 p-1 text-center text-white">
        New {name}
      </div>
      <Link href={link}>
        <button className="fixed right-8 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-200">
          +
        </button>
      </Link>
    </div>
  );
}

export default AddButton
import Link from 'next/link';
import React from 'react'
import {motion} from "framer-motion"

type AddButtonProps = {
    name: string
    link: string
    number: number
}

function AddButton({name, link, number}: AddButtonProps) {

const bottom = 13 + number*6
let space_top = `${bottom}rem`
let space_bottom = `${bottom-1}rem`

  return (
    <motion.div
      className="flex flex-row space-x-2 justify-center items-center"
      //animate={{ x: 20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 5,
      }}
    >
      <div className="fixed right-28 text-xl font-semibold rounded-md bg-slate-400 p-2 text-center text-white"
      style={{bottom: space_top}}>
        New {name}
      </div>
      <Link href={link}>
        <button className="fixed right-8 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-200"
        style={{bottom: space_bottom}}>
          +
        </button>
      </Link>
    </motion.div>
  );
}

export default AddButton
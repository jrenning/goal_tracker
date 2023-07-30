import React, { Key, ReactNode } from 'react'
import {motion} from "framer-motion"

type Props = {
  children: ReactNode;
  keyName: Key
};

function PopupTransitionLayout({children, keyName}: Props) {
  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 5,
      }}
      key={keyName}
      className='h-screen'
    >
      {children}
    </motion.div>
  );
}

export default PopupTransitionLayout
import React, { Key, ReactNode } from 'react'
import {motion} from "framer-motion"

type Props = {
  children: ReactNode
  keyName: Key
}

function PageTransitionLayout({children, keyName}: Props) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 5
      }}
      key={keyName}
    >
      {children}
    </motion.div>
  );
}

export default PageTransitionLayout
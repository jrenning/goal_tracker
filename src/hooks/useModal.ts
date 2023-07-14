import React, { useState } from "react";

export default () => {
  let [isOpen, setIsOpen] = useState<boolean>(false);
    const toggle = () => setIsOpen(!isOpen)


  return { isOpen, toggle };
};

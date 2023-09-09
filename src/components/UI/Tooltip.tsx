"use client";

import React from "react";
import ReactDOM from "react-dom";

export type ModalProps = {
  content: JSX.Element;
  isOpen: boolean;
  backgroundColor: string;
  selector: string
};

function Tooltip({
  content,
  isOpen,
  backgroundColor,
  selector
}: ModalProps) {

  const tooltip = (
    <>
      <div className="absolute z-50">
          <div
            className="mx-2 flex p-4 rounded-lg bg-gray-200 shadow-md md:mx-[25%]"
            style={{ backgroundColor: backgroundColor }}
          >
            <div className="w-full">
              <div>
                {content}
              </div>
            </div>
          </div>
      </div>
    </>
  );
  if (typeof window === "object") {
    const dom = document.querySelector(selector);
    if (isOpen && dom && typeof window === "object") {
      return ReactDOM.createPortal(tooltip, dom);
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export default Tooltip;

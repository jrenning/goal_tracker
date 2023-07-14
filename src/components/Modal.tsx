
'use client'

import React, { useState } from "react";
import ReactDOM from "react-dom";

export type ModalProps = {
  title: string;
  content: JSX.Element
  isOpen: boolean
  hide?: () => void
};

function Modal({ title, content, isOpen, hide }: ModalProps) {
    const modal = (
      <>
        <div className="z-99 fixed h-screen w-screen backdrop-blur-sm backdrop-grayscale">
          <div className="fixed left-0 right-0 top-[30%] ">
            <div className="mx-[25%] flex h-[35vh] rounded-lg bg-gray-200 shadow-md">
              <div className="w-full">
                <div>
                  <header className="flex w-full flex-row">
                    <button
                      className="m-2 rounded-full bg-red-300 px-[0.75rem] py-1"
                      onClick={hide}
                    >
                      X
                    </button>
                    <div className="ml-12 mt-2 text-2xl font-semibold">
                      {title}
                    </div>
                  </header>

                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
    if (typeof window === "object") {
        const dom = document.querySelector("#modal")
        if (isOpen &&  dom && typeof window === "object") {
            return ReactDOM.createPortal(modal, dom);
        }
        else {
            return null
        }
    }
    else {
        return null
    }
}

export default Modal;

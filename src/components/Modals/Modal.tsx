
'use client'

import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ModalContext } from "~/pages/_app";

export type ModalProps = {
  title: string;
  content: JSX.Element
  isOpen: boolean
  backgroundColor: string
};

function Modal({ title, content, isOpen, backgroundColor }: ModalProps) {

    const setModal = useContext(ModalContext)

    const closeModal = () => {
        let updated_state = {isOpen: false}
        setModal && setModal(modal => ({
            ...modal,
            ...updated_state
        }))
    }



    const modal = (
      <>
        <div className="z-50 fixed h-screen w-screen backdrop-blur-sm backdrop-grayscale">
          <div className="fixed left-0 right-0 top-[30%] ">
            <div className="mx-2 flex h-[45vh] rounded-lg bg-gray-200 shadow-md md:mx-[25%]"
            style={{backgroundColor: backgroundColor}}>
              <div className="w-full">
                <div>
                  <header className="flex w-full flex-row">
                    <div className="ml-12 mt-2 text-4xl font-mono font-semibold text-center w-full">
                      {title}
                    </div>
                    <button
                      className="m-2 rounded-full bg-red-300 px-[0.75rem] md:h-12 md:w-12 h-8 w-8 md:py-1 ml-auto hover:bg-red-400"
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      X
                    </button>
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

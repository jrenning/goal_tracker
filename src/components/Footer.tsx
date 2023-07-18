import React, { useState } from 'react'

function Footer() {
    const [current, setCurrent] = useState("Goals");
  return (
    
    <div className="sticky bottom-0 z-50 flex w-full flex-row justify-evenly bg-slate-50 py-8 shadow-md">
        <FooterSection name="Goals" icon="&#x2713;" />
        <FooterSection name="History" icon="&#x263B;" />
        <FooterSection name="Repeats" icon="&#x267B;" />
    </div>
  );
}

type FooterProps = {
    name: string
    icon: string

}

function FooterSection({name, icon}: FooterProps) {


    return (
      <div className="flex flex-col items-center justify-center hover:text-green-300 cursor-pointer">
        <div className="text-4xl">{icon}</div>
        <div>{name}</div>
      </div>
    );
}

export default Footer
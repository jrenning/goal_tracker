import Link from 'next/link';
import React, { useState } from 'react'

function Footer() {
    const [current, setCurrent] = useState("Goals");
  return (
    
    <div className="fixed bottom-0 z-50 flex w-full flex-row justify-evenly bg-slate-50 py-2 shadow-md">
        <FooterSection name="Goals" icon="&#x2713;" link="/"/>
        <FooterSection name="History" icon="&#x263B;" link="/history"/>
        <FooterSection name="Repeats" icon="&#x267B;" link="/repeats"/>
    </div>
  );
}

type FooterProps = {
    name: string
    icon: string
    link: string

}

function FooterSection({name, icon, link}: FooterProps) {


    return (
      <Link href={link}>
        <div className="flex cursor-pointer flex-col items-center justify-center hover:text-green-300">
          <div className="text-4xl">{icon}</div>
          <div>{name}</div>
        </div>
      </Link>
    );
}

export default Footer
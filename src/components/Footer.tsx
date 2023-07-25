import Link from 'next/link';
import React, { useState } from 'react'


// From fontawesome.com
const HistoryIcon = <svg viewBox="0 0 512 512"><path className='stroke-[1px] stroke-black' d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z" stroke-width=".5"/></svg>
const RepeatIcon = <svg  viewBox="0 0 448 512"><path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zM329 297L217 409c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" stroke-width=".5" stroke="black"/></svg>
const GoalIcon = <svg  viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" stroke-width="0.5"/></svg>

function Footer() {
    const [current, setCurrent] = useState("Goals");
  return (
    
    <div className="fixed bottom-0 left-0 flex w-full flex-row justify-evenly bg-slate-50  shadow-md">
        <FooterSection name="Goals" icon={GoalIcon} link="/" setCurrent={setCurrent} current={current}/>
        <FooterSection name="History" icon={HistoryIcon} link="/history" setCurrent={setCurrent} current={current}/>
        <FooterSection name="Repeats" icon={RepeatIcon} link="/repeats" setCurrent={setCurrent} current={current}/>
    </div>
  );
}

type FooterProps = {
  name: string;
  icon: JSX.Element | string;
  link: string;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
  current: string
};

function FooterSection({name, icon, link, setCurrent, current}: FooterProps) {


    return (
      <Link href={link} onClick={() => setCurrent(name)}>
        <div className=" flex cursor-pointer flex-col items-center justify-center py-2 hover:text-green-300">
          <div
            className="h-6 w-6 object-contain font-thin  text-4xl stroke-1"
            style={{ fill: current == name ? "#95fab9" : "black" }}
          >
            {icon}
          </div>
        </div>
      </Link>
    );
}

export default Footer
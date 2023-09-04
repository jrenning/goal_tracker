import React from 'react'
import { HistoryPages } from '~/pages/history';


type PageSelectionProps<T> = {
  names: any[];
  setActive: React.Dispatch<React.SetStateAction<any>>;
  active: any
};

function PageSelection<T extends unknown>({names, setActive, active}: PageSelectionProps<T>) {



  return (
    <div className="flex flex-row justify-evenly w-full items-center dark:text-white">
    {names.map((name)=> (
        <div className='font-semibold cursor-pointer' style={{borderBottom: name==active ? "solid" : "none"}} onClick={()=> setActive(name)} key={name}>{name}</div>
    ))}
    </div>
  )
}

export default PageSelection
import React from 'react'
import { HistoryPages } from '~/pages/history';


type PageSelectionProps = {
  names: HistoryPages[];
  setActive: React.Dispatch<React.SetStateAction<HistoryPages>>;
  active: HistoryPages
};

function PageSelection({names, setActive, active}: PageSelectionProps) {



  return (
    <div className="flex flex-row justify-evenly items-center dark:text-white">
    {names.map((name)=> (
        <div className='font-semibold' style={{borderBottom: name==active ? "solid" : "none"}} onClick={()=> setActive(name)} key={name}>{name}</div>
    ))}
    </div>
  )
}

export default PageSelection
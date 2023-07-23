import Link from 'next/link';
import { useRouter } from 'next/router'
import React from 'react'
import PopupTransitionLayout from '~/components/PopupTransitionLayout';

function DatePopup() {
  const router = useRouter()
  const router_date = router.query.date ? router.query.date[0] : "1/1/1900"
  const date = new Date(router_date ? router_date : "1/1/1900")

  return (
    <PopupTransitionLayout>
      <div>
        <Link href={"/repeats"}>
          <button className="m-2 rounded-full bg-slate-200 px-2 py-1 text-xl shadow-md">
            &#x2190;
          </button>
        </Link>
        <div>
          <h1 className='flex justify-center items-center text-2xl'>
            {date.getMonth()} / {date.getDay()} {date.getFullYear()}
          </h1>
        </div>
      </div>
    </PopupTransitionLayout>
  );
}

export default DatePopup
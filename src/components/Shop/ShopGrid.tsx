import React from 'react'
import { api } from '~/utils/api'
import Item from './Item'
import Link from 'next/link';

function ShopGrid() {

    const items = api.shop.getShopItems.useQuery()

  return (
    <div className="mt-12 grid w-[85%] grid-cols-2 items-center auto-rows-[150px] justify-center gap-2">
      {items.data && items.data.length > 0 ? (
        items.data.map((item) => (
          <Item name={item.name} cost={item.cost} id={item.id} key={item.id}  rarity={item.rarity} reward_category={item.reward_category}/>
        ))
      ) : (
        <div className="">Nothing in the shop today...</div>
      )}
      <div className="rounded-md flex justify-center w-[5rem] items-center h-full">
        <Link href={"/add_shop_item"} className='w-full'>
        <button className='text-3xl w-full shadow-lg rounded-lg p-4 bg-green-300 flex justify-center items-center'>+</button>
        </Link>
      </div>
    </div>
  );
}

export default ShopGrid
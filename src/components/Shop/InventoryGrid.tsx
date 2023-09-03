import React from 'react'
import { api } from '~/utils/api';
import Item from './Item';

function InventoryGrid() {

    const inventory_items = api.shop.getInventoryItems.useQuery().data
  return (
      <div className="mt-12 grid w-[85%] auto-rows-[150px] grid-cols-2 items-center justify-center gap-2">
        {inventory_items ? inventory_items.map((item)=> (
            <Item name={item.name} rarity={item.rarity} cost={item.cost} reward_category={item.reward_category} />
        )): ""}
      </div>
  );
}

export default InventoryGrid
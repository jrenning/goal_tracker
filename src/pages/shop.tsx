import React, { useState } from 'react'
import InventoryGrid from '~/components/Shop/InventoryGrid'
import ShopGrid from '~/components/Shop/ShopGrid'
import PageSelection from '~/components/UI/PageSelection'

export type ShopPages = "Shop" | "Inventory"

function shop() {
  const [activePage, setActivePage] = useState<ShopPages>("Shop")
  const names: ShopPages[] = ["Shop", "Inventory"]
  return (
    <div className="flex flex-col items-center justify-center">
      <PageSelection
        names={names}
        setActive={setActivePage}
        active={activePage}
      />

      {activePage == "Shop" && (
        <>
          <div className="mt-2  flex w-[90%] items-center justify-center border-4 border-dotted">
            <h1 className="mt-4 text-3xl font-semibold dark:text-white">
              Welcome to the Shop!
            </h1>
          </div>
          <ShopGrid />
        </>
      )}
      {activePage == "Inventory" && <div className='bg-[#d3c1b1] rounded-md mt-8 w-[95%] flex justify-center items-center pb-4'>
        <InventoryGrid />

      
      </div>}
    </div>
  );
}

export default shop
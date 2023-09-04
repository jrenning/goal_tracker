import React from "react";
import { api } from "~/utils/api";
import Item from "./Item";
import Link from "next/link";
import { Rarities } from "~/pages";
import { colors } from "~/utils/colors";

function ShopGrid() {
  const items = api.shop.getShopItems.useQuery().data;
  const expiring_items = items ? items.filter((item) => item.expire_at) : [];
  console.log(items)
  return (
    <>
      {expiring_items && expiring_items.length > 0 ? (
        <div className="rounded-md p-4 bg-red-100 w-[90%] mt-8">
          <div className="text-2xl font-bold ">Expiring soon...</div>
          <div className="mt-12 grid w-[85%] auto-rows-[150px] grid-cols-2 items-center justify-center gap-2">
            {expiring_items.map((item) => (
              <Item
                reward_category={item.reward_category}
                name={item.name}
                cost={item.cost}
                rarity={item.rarity}
                id={item.id}
                expire_at={item.expire_at ? item.expire_at : new Date()}
                type="Shop"
              />
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      {items ? (
        <>
          <RarityBox
            rarity="Common"
            items={items.filter((item) => item.rarity === "Common")}
          />
          <RarityBox
            rarity="Rare"
            items={items.filter((item) => item.rarity === "Rare")}
          />
          <RarityBox
            rarity="Epic"
            items={items.filter((item) => item.rarity === "Epic")}
          />
          <RarityBox
            rarity="Legendary"
            items={items.filter((item) => item.rarity === "Legendary")}
          />
        </>
      ) : (
        ""
      )}

      <div className="mt-12 flex h-full w-[5rem] items-center justify-center rounded-md">
        <Link href={"/add_shop_item"} className="w-full">
          <button className="flex w-full items-center justify-center rounded-lg bg-green-300 p-4 text-3xl shadow-lg">
            +
          </button>
        </Link>
      </div>
    </>
  );
}

export default ShopGrid;

type RarityBoxProps = {
  rarity: Rarities;
  items: any;
};

function RarityBox({ rarity, items }: RarityBoxProps) {
  return (
    <>
      {items && items.length > 0 ? (
        <div
          style={{ backgroundColor: colors[`${rarity}_light`] }}
          className="mt-4 rounded-md p-4 w-[90%]"
        >
            <div className="text-2xl font-bold">{rarity}</div>
            <div className=" grid auto-rows-[150px] grid-cols-2 gap-4">
              {/* @ts-ignore */}
              {items.map((item) => (
                <Item
                  reward_category={item.reward_category}
                  name={item.name}
                  cost={item.cost}
                  rarity={item.rarity}
                  id={item.id}
                  type="Shop"
                />
              ))}
            </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

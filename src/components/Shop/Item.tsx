import React, { useState } from "react";
import usePopup from "~/hooks/usePopup";
import { Rarities, RewardCategories } from "~/pages";
import { api } from "~/utils/api";
import { colors } from "~/utils/colors";

export function shortenName(name: string, max_length: number) {
  if (name.length > max_length) {
    return `${name.slice(0, max_length)}...`;
  }
  return name;
}

type ItemProps = {
  name: string;
  rarity: Rarities
  reward_category: RewardCategories
  cost: number;
  id: number
};
// icons from fontawesome.com
const OutdoorsIcon = <svg viewBox="0 0 448 512"><path d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208H104L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320H80L5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5H192v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448H424.5c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320h33.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208h24.9c12.7 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z"/></svg>
const GiftIcon = <svg viewBox="0 0 512 512"><path d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z"/></svg>
const LeisureIcon = <svg viewBox="0 0 640 512"><path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>
const ExperienceIcon = <svg viewBox="0 0 576 512"><path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"/></svg>
const FoodIcon = <svg viewBox="0 0 448 512"><path d="M367.1 160c.6-5.3 .9-10.6 .9-16C368 64.5 303.5 0 224 0S80 64.5 80 144c0 5.4 .3 10.7 .9 16H80c-26.5 0-48 21.5-48 48s21.5 48 48 48h53.5 181H368c26.5 0 48-21.5 48-48s-21.5-48-48-48h-.9zM96 288L200.8 497.7c4.4 8.8 13.3 14.3 23.2 14.3s18.8-5.5 23.2-14.3L352 288H96z"/></svg>

const icons = {
  Outdoors: OutdoorsIcon,
  Gift: GiftIcon,
  Leisure: LeisureIcon,
  Experience: ExperienceIcon,
  Food: FoodIcon
}

function Item({ name, cost, rarity, reward_category, id }: ItemProps) {
  const [clicked, setClicked] = useState(false);
  const utils = api.useContext()

  const {setErrorPopup, setSuccessPopup} = usePopup()

  const buy_item = api.shop.buyShopItem.useMutation({
    async onSuccess(data) {
      await utils.shop.invalidate()
      setSuccessPopup(`Bought ${data?.name}`)
    },
    onError(err) {
      setErrorPopup(err.message)
    }
  })

  const delete_item = api.shop.deleteShopItemById.useMutation({
    async onSuccess(data) {
      await utils.shop.invalidate()
    },
    onError(err) {
      setErrorPopup(err.message)
    }
  })

  const buyItem = async () => {
    const data = await buy_item.mutateAsync({
      id: id
    })
  }

  const deleteItem = async () => {
    const data = await delete_item.mutateAsync({
      id: id
    })
  }



  return (
    <div
      className="relative flex shadow-lg border-black border-2 border-double flex-col h-full items-center justify-center space-y-4 rounded-md p-4"
      style={{backgroundColor: colors[rarity]}}
      onClick={() => setClicked(!clicked)}
    >
      <div className="text-lg font-semibold">{shortenName(name, 20)}</div>
      {icons[reward_category]}
      <div className="flex flex-row space-x-2 justify-center items-center">
        <div>{cost}</div>
        <div className="text-2xl font-bold  text-yellow-400">&#x274D;</div>
      </div>
      {clicked ? (
        <div className="absolute bottom-[50%] flex translate-y-[50%] space-x-2 flex-row">
          <div className=" rounded-md text-sm font-semibold bg-green-300 px-2 py-1  shadow-lg"
          onClick={()=> buyItem()}>
            Buy Item
          </div>
          <div className=" rounded-md text-sm font-semibold bg-red-300 px-2 py-1  shadow-lg"
          onClick={()=> deleteItem()}>
            Delete
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Item;

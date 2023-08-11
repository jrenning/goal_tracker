import React, { useState } from "react";
import usePopup from "~/hooks/usePopup";
import { api } from "~/utils/api";

export function shortenName(name: string, max_length: number) {
  if (name.length > max_length) {
    return `${name.slice(0, max_length)}...`;
  }
  return name;
}

type ItemProps = {
  name: string;
  cost: number;
  id: number
};

function Item({ name, cost, id }: ItemProps) {
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

  const buyItem = async () => {
    const data = await buy_item.mutateAsync({
      id: id
    })
  }



  return (
    <div
      className="relative flex flex-col items-center justify-center space-y-4 rounded-md bg-slate-100 p-4"
      onClick={() => setClicked(!clicked)}
    >
      <div className="text-lg font-semibold">{shortenName(name, 20)}</div>
      <div className="flex flex-row space-x-2 justify-center items-center">
        <div>{cost}</div>
        <div className="text-xl font-bold  text-yellow-300">&#x274D;</div>
      </div>
      {clicked ? (
        <div className="absolute bottom-[50%] flex translate-y-[50%] space-x-2 flex-row">
          <div className=" rounded-md bg-green-300 px-2 py-1  shadow-lg"
          onClick={()=> buyItem()}>
            Buy Item
          </div>
          <div className=" rounded-md bg-red-300 px-2 py-1  shadow-lg">
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

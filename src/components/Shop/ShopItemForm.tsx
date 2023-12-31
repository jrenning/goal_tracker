import React, { FormEvent, useState } from "react";
import Form from "../UI/Form";
import { api } from "~/utils/api";
import usePopup from "~/hooks/usePopup";
import SubmitButton from "../UI/SubmitButton";
import { RepeatForm } from "../Goals/GoalForm";
import { DaysOfWeek, Rarities, RepeatType, RewardCategories } from "~/pages";
import { convertToUTC } from "~/utils/datetime";
import { useRouter } from "next/router";

type ShopFormProps = {
  backlink: string;
};

function ShopItemForm({ backlink }: ShopFormProps) {
  const utils = api.useContext();
  const { setErrorPopup, setSuccessPopup } = usePopup();
  const [repeating, setRepeating] = useState(false);
  const router = useRouter()

  const shop_item = api.shop.createShopItem.useMutation({
    async onSuccess(data) {
      await utils.shop.invalidate();
      setSuccessPopup(`Created item ${data.name}`);
    },
    async onError(err) {
      setErrorPopup(`Couldn't add shop item, ${err}`);
    },
  });

  const createShopItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      rarity: {value: Rarities}
      reward_category: {value: RewardCategories}
      expire_date: { value: string | undefined };
      repeating: { value: boolean };
      type: { value: RepeatType | undefined };
      days: { value: DaysOfWeek[] | undefined };
      start_date: { value: string | undefined };
      end_date: { value: string | undefined };
      repeat_freq: { value: string | undefined };
    };

    let selected_days: DaysOfWeek[] = [];
    //@ts-ignore
    if (e.target.days) {
      //@ts-ignore
      const opts: HTMLOptionsCollection = e.target.days;

      for (let i = 0; i < opts.length; i++) {
        if (opts[i]?.selected) {
          //@ts-ignore
          selected_days.push(opts[i].value);
        }
      }
    }

    await shop_item.mutateAsync({
      name: target.name.value,
      rarity: target.rarity.value,
      reward_category: target.reward_category.value,
      expire_at:
        target.expire_date && target.expire_date.value
          ? convertToUTC(new Date(target.expire_date.value))
          : undefined,
      repeat_type: target.type ? target.type.value : undefined,
      days_of_week: selected_days,
      repeat_freq: target.repeat_freq
        ? Number(target.repeat_freq.value)
        : undefined,
      start_date:
        target.start_date && target.start_date.value
          ? convertToUTC(new Date(target.start_date.value))
          : undefined,
      end_date:
        target.end_date && target.end_date.value
          ? convertToUTC(new Date(target.end_date.value))
          : undefined,
    });

    router.push(backlink)
  };

  // TODO make this not hardcoded
  const reward_categories = ["Outdoors", "Gift", "Leisure", "Experience", "Food"]

  return (
    <Form backlink={backlink} submitFunction={createShopItem}>
      <label htmlFor="name">Name</label>
      <input type="text" required={true} id="name" />
      <label htmlFor="rarity">Rarity</label>
      <select id="rarity">
        <option>Common</option>
        <option>Rare</option>
        <option>Epic</option>
        <option>Legendary</option>
      </select>
      <label htmlFor="rewards_category">Reward Category</label>
      <select id="reward_category">
        {reward_categories.map((category)=> (
            <option key={category}>{category}</option>
        ))}
      </select>
      <label>Expire Date</label>
      <input type="date" required={false} id="expire_date" />
      <label>Repeating</label>
      <input type="checkbox" onChange={() => setRepeating(!repeating)} />
      {repeating ? <RepeatForm repeating={repeating} /> : ""}
      <SubmitButton />
    </Form>
  );
}

export default ShopItemForm;

import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, ReactElement, useEffect, useState } from "react";
import { DaysOfWeek, GoalCategories, RepeatType } from "~/pages";
import { api } from "~/utils/api";
import { convertToUTC, getDateInputFormatString } from "~/utils/datetime";
import useDataActions from "~/hooks/useDataActions";
import { uid } from "~/utils/goals";

type GoalFormProps = {
  backlink: string;
  // used to update existing goals
  id?: number;
};

type CheckItem = {
  name: string;
  uid: string;
};

const getLeadingZeroFormat = (month_or_day: number) => {
  if (month_or_day < 10) {
    return `0${month_or_day}`;
  } else {
    return month_or_day;
  }
};

function GoalForm({ backlink, id }: GoalFormProps) {
  const utils = api.useContext();
  const [repeating, setRepeating] = useState(false);

  const updateData = api.goals.getGoalById.useQuery({
    id: id ? id : 0,
  }).data;

  // TODO move this stuff into a hook
  const [checklistItems, setChecklistItems] = useState<CheckItem[]>([]);

  const updateChecklist = (name: string) => {
    const new_item: CheckItem = {
      name: name,
      uid: uid(),
    };
    setChecklistItems((items) => [...items, new_item]);
  };

  useEffect(() => {
    if (updateData) {
      updateData.checklist.forEach((item) => {
        updateChecklist(item.name);
      });

      if (updateData.repeat) {
        setRepeating(true)
      }
    }
  }, []);

  const today = new Date();
  const today_string = `${today.getFullYear()}-${getLeadingZeroFormat(
    today.getMonth() + 1
  )}-${getLeadingZeroFormat(today.getDate())}`;

  const router = useRouter();

  const { addGoal, updateGoal } = useDataActions();

  const createGoal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO fix this terrible form parsing
    const target = e.target as typeof e.target & {
      name: { value: string };
      difficulty: { value: string };
      category: { value: GoalCategories };
      due_date: { value: string | undefined };
      repeating: { value: boolean };
      type: { value: RepeatType | undefined };
      days: { value: DaysOfWeek[] | undefined };
      start_date: { value: string | undefined };
      end_date: { value: string | undefined };
      repeat_freq: { value: string | undefined };
      checklist_item: { value: string[] | undefined };
    };

    let checklist_items: string[] = [];
    //@ts-ignore
    if (e.target.checklist_item) {
      //@ts-ignore
      const items: RadioNodeList = e.target.checklist_item;
      items.forEach((input) => {
        //@ts-ignore
        checklist_items.push(input.value);
      });
    }

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

    const formData = {
      name: target.name.value,
      difficulty: Number(target.difficulty.value),
      category: target.category.value,
      due_date:
        target.due_date && target.due_date.value
          ? convertToUTC(new Date(target.due_date.value))
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
      checklist_items: checklist_items,
    };

    if (id) {
      await updateGoal.mutateAsync({...formData, id: id})
    }
    else {
      await addGoal.mutateAsync(formData);
    }
    

    router.push(backlink);
  };


  return (
    <div className="mx-16 my-4  rounded-lg bg-green-100 py-4">
      <Link href={backlink}>
        <button className="ml-2 rounded-full bg-red-200 px-2 py-0 hover:opacity-80">
          X
        </button>
      </Link>
      <div className="flex items-center justify-center">
        <form
          className="items-left flex flex-col space-y-4 "
          onSubmit={(e) => createGoal(e)}
        >
          <label htmlFor="name">Name</label>
          <input
            required={true}
            id="name"
            defaultValue={updateData ? updateData.name : ""}
          />
          <label>Checklist Items</label>
          {checklistItems.map((item) => (
            <CheckListItem
              name={item.name}
              key={item.uid}
              setCheckListItems={setChecklistItems}
              checkListItems={checklistItems}
              uid={item.uid}
            />
          ))}
          <button
            className="rounded-md bg-green-300"
            type="button"
            onClick={() => {
              updateChecklist("");
            }}
          >
            Add checklist item
          </button>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            defaultValue={updateData ? updateData.category : "Physical"}
          >
            <option>Physical</option>
            <option>Education</option>
            <option>Social</option>
            <option>Hobby</option>
            <option>Career</option>
          </select>
          <label htmlFor="difficulty">Difficulty</label>
          <input
            type="range"
            list="difficulties"
            min={1}
            max={4}
            required={true}
            id="difficulty"
            defaultValue={updateData ? updateData.difficulty : 1}
          ></input>
          <datalist id="difficulties">
            <option value={1}></option>
            <option value={2}></option>
            <option value={3}></option>
            <option value={4}></option>
          </datalist>
          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            id="due_date"
            min={today_string}
            defaultValue={
              updateData && updateData.due_date
                ? getDateInputFormatString(updateData.due_date)
                : ""
            }
          />
          <div className="flex flex-row space-x-4">
            <label htmlFor="repeating">Repeating</label>
            <input
              type="checkbox"
              id="repeating"
              onChange={() => setRepeating(!repeating)}
              checked={repeating}
            />
          </div>
          {repeating ? <RepeatForm repeating={repeating} id={id} /> : ""}
          <button
            type="submit"
            className=" rounded-md bg-green-200 px-4 py-[5px] hover:opacity-70"
          >
            {id ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}

type ChecklistItemProps = {
  checkListItems: CheckItem[];
  setCheckListItems: React.Dispatch<React.SetStateAction<CheckItem[]>>;
  name?: string;
  uid: string;
};

function CheckListItem({
  checkListItems,
  setCheckListItems,
  name,
  uid,
}: ChecklistItemProps) {
  const removeChecklistItem = (uid: string) => {
    const newChecklist = checkListItems.filter((item) => item.uid != uid);

    setCheckListItems(newChecklist);
  };
  return (
    <div className="relative flex flex-row space-x-2">
      <input
        type="text"
        id={`checklist_item`}
        name="checklist_item"
        value={name ? name : "Add item here..."}
      />
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-red-300 text-lg"
        onClick={() => removeChecklistItem(uid)}
      >
        -
      </button>
    </div>
  );
}

type RepeatFormProps = {
  repeating: boolean;
  id?: number
};

export function RepeatForm({ repeating, id }: RepeatFormProps) {
  const [weekly, setWeekly] = useState(false);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date();




  // min input on date input needs exactly yyyy-mm-dd format so need to add leading zeros
  const today_string = getDateInputFormatString(today)


  const updateData = api.goals.getGoalById.useQuery({
    id: id ? id : 0
  }).data

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="type">Type</label>
      <select
        id="type"
        required={repeating}
        onChange={(e) => {
          e.target.value == "Weekly" ? setWeekly(true) : setWeekly(false);
        }}
        defaultValue={
          updateData && updateData.repeat ? updateData.repeat.type : "Daily"
        }
      >
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
        <option>Yearly</option>
      </select>
      {weekly ? (
        <div className="mt-8 flex">
          <select
            id="days"
            multiple={true}
            className="mx-4 mt-4 w-full items-center justify-center text-center"
            defaultValue={updateData && updateData.repeat ? updateData.repeat.days : [""]}
          >
            {days.map((day, index) => (
              <DaySelect day={day} key={day} />
            ))}
          </select>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col items-center justify-center">
        <label htmlFor="repeat_freq">Repeat every: </label>
        <input
          type="number"
          id="repeat_freq"
          required={repeating}
          className="text-center"
          defaultValue={
            updateData && updateData.repeat
              ? updateData.repeat.repeat_frequency
              : ""
          }
        />
      </div>
      <label htmlFor="start_date">Start Date</label>
      <input
        type="date"
        required={repeating}
        min={today_string}
        id="start_date"
        defaultValue={
          updateData && updateData.repeat
            ? getDateInputFormatString(updateData.repeat.start_date)
            : ""
        }
      />
      <label htmlFor="end_date">End Date</label>
      <input
        type="date"
        min={today_string}
        id="end_date"
        defaultValue={
          updateData && updateData.repeat && updateData.repeat.stop_date
            ? getDateInputFormatString(updateData.repeat.stop_date)
            : ""
        }
      />
    </div>
  );
}

type DayProps = {
  day: string;
};

function DaySelect({ day }: DayProps) {
  return <option>{day}</option>;
}

export default GoalForm;

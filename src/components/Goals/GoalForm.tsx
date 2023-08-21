import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, ReactElement,useState } from "react";
import { DaysOfWeek, GoalCategories, RepeatType } from "~/pages";
import { api } from "~/utils/api";
import { convertToUTC } from "~/utils/datetime";
import useDataActions from "~/hooks/useDataActions";

type GoalFormProps = {
  backlink: string;
};

const getLeadingZeroFormat = (month_or_day: number) => {
  if (month_or_day < 10) {
    return `0${month_or_day}`;
  } else {
    return month_or_day;
  }
};

function GoalForm({ backlink }: GoalFormProps) {
  const utils = api.useContext();
  const [repeating, setRepeating] = useState(false);

  // TODO move this stuff into a hook
  const [checklistItems, setChecklistItems] = useState<ReactElement[]>([]);

  const [checkListSize, setCheckListSize] = useState(0);

  const getSize = () => {
    return checkListSize;
  };

  const today = new Date();
  const today_string = `${today.getFullYear()}-${getLeadingZeroFormat(
    today.getMonth() + 1
  )}-${getLeadingZeroFormat(today.getDate())}`;

  const router = useRouter();

  const {addGoal} = useDataActions()

  const createGoal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target)
    // TODO fix this terrible form parsing
    const target = e.target as typeof e.target & {
      name: { value: string };
      difficulty: { value: string };
      category: { value: GoalCategories };
      due_date: {value: string | undefined}
      repeating: { value: boolean };
      type: { value: RepeatType | undefined };
      days: { value: DaysOfWeek[] | undefined };
      start_date: { value: string | undefined };
      end_date: { value: string | undefined };
      repeat_freq: {value: string | undefined}
      checklist_item: { value: string[] | undefined };
    };

    console.log(target)

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

    const call = await addGoal.mutateAsync({
      name: target.name.value,
      difficulty: Number(target.difficulty.value),
      category: target.category.value,
      due_date:
        target.due_date && target.due_date.value
          ? convertToUTC(new Date(target.due_date.value))
          : undefined,
      repeat_type: target.type ? target.type.value : undefined,
      days_of_week: selected_days,
      repeat_freq: target.repeat_freq ? Number(target.repeat_freq.value) : undefined,
      start_date:
        target.start_date && target.start_date.value
          ? convertToUTC(new Date(target.start_date.value))
          : undefined,
      end_date:
        target.end_date && target.end_date.value
          ? convertToUTC(new Date(target.end_date.value))
          : undefined,
      checklist_items: checklist_items,
    });



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
          <input required={true} id="name" />
          <label>Checklist Items</label>
          {checklistItems.map((item) => (
            <>{item}</>
          ))}
          <button
            className="rounded-md bg-green-300"
            type="button"
            onClick={() => {
              setCheckListSize((size) => size + 1);
              setChecklistItems((items) => [
                ...items,
                <CheckListItem
                  key={getSize()}
                  size={getSize()}
                  checkListItems={checklistItems}
                  setCheckListItems={setChecklistItems}
                />,
              ]);
              console.log(checklistItems);
            }}
          >
            Add checklist item
          </button>
          <label htmlFor="category">Category</label>
          <select id="category">
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
          ></input>
          <datalist id="difficulties">
            <option value={1}></option>
            <option value={2}></option>
            <option value={3}></option>
            <option value={4}></option>
          </datalist>
          <label htmlFor="due_date">Due Date</label>
          <input type="date" id="due_date" min={today_string} />
          <div className="flex flex-row space-x-4">
            <label htmlFor="repeating">Repeating</label>
            <input
              type="checkbox"
              id="repeating"
              onChange={() => setRepeating(!repeating)}
            />
          </div>
          {repeating ? <RepeatForm repeating={repeating} /> : ""}
          <button
            type="submit"
            className=" rounded-md bg-green-200 px-4 py-[5px] hover:opacity-70"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

type ChecklistItemProps = {
  checkListItems: ReactElement[];
  setCheckListItems: React.Dispatch<
    React.SetStateAction<
      React.ReactElement<any, string | React.JSXElementConstructor<any>>[]
    >
  >;
  size: number;
};

function CheckListItem({
  checkListItems,
  setCheckListItems,
  size,
}: ChecklistItemProps) {
  const removeChecklistItem = (key: number) => {
    const newChecklist = checkListItems.filter((item) => item.key != key);

    setCheckListItems(newChecklist);
  };
  return (
    <div className="relative flex flex-row space-x-2">
      <input
        type="text"
        id={`checklist_item`}
        name="checklist_item"
        placeholder="Add item here..."
      />
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-red-300 text-lg"
        onClick={() => removeChecklistItem(size)}
      >
        -
      </button>
    </div>
  );
}

type RepeatFormProps = {
  repeating: boolean;
};

export function RepeatForm({ repeating }: RepeatFormProps) {
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
  const today_string = `${today.getFullYear()}-${getLeadingZeroFormat(
    today.getMonth() + 1
  )}-${getLeadingZeroFormat(today.getDate())}`;

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="type">Type</label>
      <select
        id="type"
        required={repeating}
        onChange={(e) => {
          e.target.value == "Daily" ? setWeekly(true) : setWeekly(false);
        }}
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
          >
            {days.map((day, index) => (
              <DaySelect day={day} key={day} />
            ))}
          </select>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col justify-center items-center">
        <label htmlFor="repeat_freq">Repeat every: </label>
        <input type="number" id="repeat_freq" className="text-center" placeholder="1" />
      </div>
      <label htmlFor="start_date">Start Date</label>
      <input
        type="date"
        required={repeating}
        min={today_string}
        id="start_date"
      />
      <label htmlFor="end_date">End Date</label>
      <input type="date" min={today_string} id="end_date" />
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

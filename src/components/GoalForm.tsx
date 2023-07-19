import React, { FormEvent, useState } from "react";
import { DaysOfWeek, GoalCategories, RepeatType } from "~/pages";
import { api } from "~/utils/api";

type GoalFormProps = {
  setNewGoal: React.Dispatch<React.SetStateAction<boolean>>;
};

function GoalForm({ setNewGoal }: GoalFormProps) {
  const utils = api.useContext();
  const [repeating, setRepeating] = useState(false);

  const add_call = api.goals.addGoal.useMutation({
    async onSuccess(data) {
      await utils.goals.invalidate();
      data && alert(`${data.name} was added!!`);
    },
  });

  const createGoal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
      exp: { value: string };
      difficulty: { value: string };
      category: { value: GoalCategories };
      repeating: { value: boolean };
      type: { value: RepeatType | undefined };
      days: { value: DaysOfWeek[] | undefined };
      start_date: { value: Date | undefined };
      end_date: { value: Date | undefined };
    };
    let selected_days: DaysOfWeek[] = [];
    //@ts-ignore
    const opts: HTMLOptionsCollection = e.target.days.options;

    for (let i = 0; i < opts.length; i++) {
      if (opts[i]?.selected) {
        //@ts-ignore
        selected_days.push(opts[i].value);
      }
    }

    if (repeating) {
      await add_call.mutateAsync({
        name: target.name.value,
        exp: Number(target.exp.value),
        difficulty: Number(target.difficulty.value),
        category: target.category.value,
        repeat_type: target.type.value,
        days_of_week: selected_days,
        start_date: target.start_date.value,
        end_date: target.end_date.value,
      });
    } else {
      await add_call.mutateAsync({
        name: target.name.value,
        exp: Number(target.exp.value),
        difficulty: Number(target.difficulty.value),
        category: target.category.value,
      });
    }

    setNewGoal(false);
  };

  return (
    <div className="mx-16 my-4  rounded-lg bg-green-100 py-4">
      <button
        className="ml-2 rounded-full bg-red-200 px-2 py-0 hover:opacity-80"
        onClick={() => setNewGoal(false)}
      >
        X
      </button>
      <div className="flex items-center justify-center">
        <form
          className="items-left flex flex-col space-y-4 "
          onSubmit={(e) => createGoal(e)}
        >
          <label htmlFor="name">Name</label>
          <input required={true} id="name" />
          <label htmlFor="category">Category</label>
          <select id="category">
            <option>Physical</option>
            <option>Education</option>
            <option>Social</option>
            <option>Hobby</option>
            <option>Odd Job</option>
          </select>
          <label htmlFor="exp">Exp</label>
          <input type="number" required={true} id="exp"></input>
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

type RepeatFormProps = {
  repeating: boolean;
};

function RepeatForm({ repeating }: RepeatFormProps) {
  const [daily, setDaily] = useState(true);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getLeadingZeroFormat = (month_or_day: number) => {
    if (month_or_day < 10) {
      return `0${month_or_day}`;
    } else {
      return month_or_day;
    }
  };

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
          e.target.value == "Daily" ? setDaily(true) : setDaily(false);
        }}
      >
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
        <option>Yearly</option>
      </select>
      {daily ? (
        <div className="mt-8 flex w-full">
          <select
            id="days"
            multiple={true}
            className="mx-10 mt-4 w-full items-center justify-center text-center"
          >
            {days.map((day, index) => (
              <DaySelect day={day} key={day} />
            ))}
          </select>
        </div>
      ) : (
        ""
      )}
      <label htmlFor="start_date">Start Date</label>
      <input type="date" required={repeating} min={today_string} />
      <label htmlFor="end_date">End Date</label>
      <input type="date" required={repeating} min={today_string} />
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

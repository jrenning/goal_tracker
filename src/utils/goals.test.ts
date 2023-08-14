import { describe, test, expect } from "vitest";
import { calculateExp, getRepeatTypeString } from "./goals";
import { RepeatType } from "~/pages";

describe("Test repeat string", () => {
  test.each([
    {
      repeat_type: "Daily",
      frequency: 2,
      days: [],
      expected: "Repeats every 2 days",
    },
    {
      repeat_type: "Weekly",
      frequency: 1,
      days: ["Monday", "Wednesday"],
      expected: "Repeats weekly on Monday, Wednesday",
    },
    {
      repeat_type: "Weekly",
      frequency: 2,
      days: ["Monday", "Wednesday"],
      expected: "Repeats every 2 weeks on Monday, Wednesday",
    },
    {
      repeat_type: "Monthly",
      frequency: 2,
      days: [],
      expected: "Repeats every 2 months",
    },
    {
      repeat_type: "Monthly",
      frequency: 1,
      days: [],
      expected: "Repeats every month",
    },
  ])(
    "$repeat_type, $frequency, $days -> $expected",
    ({ repeat_type, frequency, days, expected }) => {
      //@ts-ignore
      const result = getRepeatTypeString(repeat_type, frequency, days);

      expect(result).toBe(expected);
    }
  );
});

describe("Test calculate exp", () => {
  test.each([
    {
      difficulty: 1,
      checklist_items: 0,
      due_date: undefined,
      repeating: false,
      expected: 2,
    },
    {
      difficulty: 2,
      checklist_items: 0,
      due_date: undefined,
      repeating: false,
      expected: 4,
    },
    {
      difficulty: 1,
      checklist_items: 3,
      due_date: undefined,
      repeating: false,
      expected: 5,
    },
    {
      difficulty: 1,
      checklist_items: 5,
      due_date: undefined,
      repeating: false,
      expected: 6,
    },
    {
      difficulty: 1,
      checklist_items: 0,
      due_date: new Date(),
      repeating: false,
      expected: 5,
    },
    {
      difficulty: 1,
      checklist_items: 0,
      due_date: new Date(),
      repeating: true,
      expected: 3,
    },
    {
      difficulty: 5,
      checklist_items: 4,
      due_date: new Date(),
      repeating: false,
      expected: 17,
    },
  ])("", ({ difficulty, checklist_items, due_date, repeating, expected }) => {
    const data = calculateExp(difficulty, checklist_items, due_date, repeating);

    expect(data).toBe(expected);
  });
});

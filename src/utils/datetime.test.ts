import { describe, test, expect } from "vitest";
import { getDaysBetweenDates } from "./datetime";



test("test days between dates", ()=> {
    const diff = getDaysBetweenDates(new Date(2023, 1, 1), new Date(2023, 1, 3))

    expect(diff).toBe(2)
})
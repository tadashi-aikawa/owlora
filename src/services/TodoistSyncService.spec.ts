import { Moment } from "moment"
import * as moment from "moment"
import { toRepetition } from "./TodoistSyncService"
import { Repetition } from "../models/Repetition"

const FORMAT = "YYYY/M/D"
const d = (v: string): Moment => moment(v, FORMAT)

describe.each`
dateString                | content        | exDay        | exDayOfWeek               | exWeek           | exMonth      | exDatesExcepted
${"every day"}            | ${"task"}      | ${"every"}   | ${[0, 1, 2, 3, 4, 5, 6]}  | ${"every"}       | ${"every"}   | ${[]}
${"every workday"}        | ${"task"}      | ${"every"}   | ${[1, 2, 3, 4, 5]}        | ${"every"}       | ${"every"}   | ${[]}
${"every monday"}         | ${"task"}      | ${"every"}   | ${[1]}                    | ${"every"}       | ${"every"}   | ${[]}
${"every wed,fri"}        | ${"task"}      | ${"every"}   | ${[3, 5]}                 | ${"every"}       | ${"every"}   | ${[]}
${"every wed, fri"}       | ${"task"}      | ${"every"}   | ${[3, 5]}                 | ${"every"}       | ${"every"}   | ${[]}
${"every other monday"}   | ${"task"}      | ${"every"}   | ${[1]}                    | ${"every other"} | ${"every"}   | ${[]}
${"every other mon,wed"}  | ${"task"}      | ${"every"}   | ${[1, 3]}                 | ${"every other"} | ${"every"}   | ${[]}
`(
    "toRepetition returns when $dateString",
    ({ dateString, content, exDay, exDayOfWeek, exWeek, exMonth, exDatesExcepted }) => {
        const r: Repetition = toRepetition(dateString, content)
        test(`day is ${exDay}`, () => expect(r.day).toEqual(exDay))
        test(`dayOfWeek is ${exDayOfWeek}`, () => expect(r.dayOfWeek).toEqual(exDayOfWeek))
        test(`week is ${exWeek}`, () => expect(r.week).toEqual(exWeek))
        test(`month is ${exMonth}`, () => expect(r.month).toEqual(exMonth))
        test(`datesExpected is ${exDatesExcepted}`, () => expect(r.datesExcepted).toEqual(exDatesExcepted))
    }
)

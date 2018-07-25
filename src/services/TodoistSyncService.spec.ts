import {toRepetition} from "./TodoistSyncService"
import {Repetition} from "../models/Repetition"

const FORMAT = "YYYY/M/D"
// now is 2000/07/01 !!!
require('jest-mock-now')(new Date('2000-07-01'));


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

describe.each`
dateString        | content                    | exDay      | exDayOfWeek | exWeek     | exMonth    | exDatesExcepted
${"every monday"} | ${"task x7/20"}            | ${"every"} | ${[1]}      | ${"every"} | ${"every"} | ${["2000/7/20"]}
${"every monday"} | ${"task x7/22"}            | ${"every"} | ${[1]}      | ${"every"} | ${"every"} | ${["2000/7/22"]}
${"every monday"} | ${"task x2001/7/20"}       | ${"every"} | ${[1]}      | ${"every"} | ${"every"} | ${["2001/7/20"]}
${"every monday"} | ${"task x7/20 x2001/7/21"} | ${"every"} | ${[1]}      | ${"every"} | ${"every"} | ${["2001/7/21", "2000/7/20"]}
`(
    "toRepetition returns if content is $content",
    ({ dateString, content, exDay, exDayOfWeek, exWeek, exMonth, exDatesExcepted }) => {
        const r: Repetition = toRepetition(dateString, content)
        test(`day is ${exDay}`, () => expect(r.day).toEqual(exDay))
        test(`dayOfWeek is ${exDayOfWeek}`, () => expect(r.dayOfWeek).toEqual(exDayOfWeek))
        test(`week is ${exWeek}`, () => expect(r.week).toEqual(exWeek))
        test(`month is ${exMonth}`, () => expect(r.month).toEqual(exMonth))
        test(`datesExpected is ${exDatesExcepted}`, () => expect(r.datesExcepted.map(x =>
                    x.format(FORMAT)
                )).toEqual(exDatesExcepted))
    }
)

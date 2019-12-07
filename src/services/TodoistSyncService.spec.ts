import { toDaysOfWeek, toRepetition } from "./TodoistSyncService"
import { Repetition } from "../models/Repetition"

const FORMAT = "YYYY/M/D"
// now is 2000/07/01 !!!
require("jest-mock-now")(new Date("2000-07-01"))

describe.each`
    daysOfWeekStr           | expected
    ${"mon"}                | ${[1]}
    ${"mon, tue"}           | ${[1, 2]}
    ${"mon, tue, thu, fri"} | ${[1, 2, 4, 5]}
`("toDaysOfWeek($daysOfWeekStr)", ({ daysOfWeekStr, expected }) => {
    test(`returns ${expected}`, () => expect(toDaysOfWeek(daysOfWeekStr)).toEqual(expected))
})

describe.each`
    dateString                        | content   | exDay      | exDayOfWeek              | exWeek           | exMonth          | exDatesExcepted | exLastDate
    ${"every day"}                    | ${"task"} | ${"every"} | ${[0, 1, 2, 3, 4, 5, 6]} | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"Every Days"}                   | ${"task"} | ${"every"} | ${[0, 1, 2, 3, 4, 5, 6]} | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every WORKDAY"}                | ${"task"} | ${"every"} | ${[1, 2, 3, 4, 5]}       | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every workdays"}               | ${"task"} | ${"every"} | ${[1, 2, 3, 4, 5]}       | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every monday"}                 | ${"task"} | ${"every"} | ${[1]}                   | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every mondays"}                | ${"task"} | ${"every"} | ${[1]}                   | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every WED,fri"}                | ${"task"} | ${"every"} | ${[3, 5]}                | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every weds, Fris"}             | ${"task"} | ${"every"} | ${[3, 5]}                | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every mon, tue, thu, fri"}     | ${"task"} | ${"every"} | ${[1, 2, 4, 5]}          | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every Other monday"}           | ${"task"} | ${"every"} | ${[1]}                   | ${"every other"} | ${"every"}       | ${[]}           | ${""}
    ${"every other mondays"}          | ${"task"} | ${"every"} | ${[1]}                   | ${"every other"} | ${"every"}       | ${[]}           | ${""}
    ${"every other mon,wed"}          | ${"task"} | ${"every"} | ${[1, 3]}                | ${"every other"} | ${"every"}       | ${[]}           | ${""}
    ${"every other mons,wed"}         | ${"task"} | ${"every"} | ${[1, 3]}                | ${"every other"} | ${"every"}       | ${[]}           | ${""}
    ${"every 1 mon"}                  | ${"task"} | ${"every"} | ${[1]}                   | ${[1]}           | ${"every"}       | ${[]}           | ${""}
    ${"every 1st mons"}               | ${"task"} | ${"every"} | ${[1]}                   | ${[1]}           | ${"every"}       | ${[]}           | ${""}
    ${"every other 2Th Mon"}          | ${"task"} | ${"every"} | ${[1]}                   | ${[2]}           | ${"every other"} | ${[]}           | ${""}
    ${"every 5"}                      | ${"task"} | ${[5]}     | ${[0, 1, 2, 3, 4, 5, 6]} | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every 7, 14"}                  | ${"task"} | ${[7, 14]} | ${[0, 1, 2, 3, 4, 5, 6]} | ${"every"}       | ${"every"}       | ${[]}           | ${""}
    ${"every days ending 2018-07-07"} | ${"task"} | ${"every"} | ${[0, 1, 2, 3, 4, 5, 6]} | ${"every"}       | ${"every"}       | ${[]}           | ${"2018/7/7"}
`(
    "toRepetition returns when $dateString",
    ({ dateString, content, exDay, exDayOfWeek, exWeek, exMonth, exDatesExcepted, exLastDate }) => {
        const r: Repetition = toRepetition(dateString, content)
        test(`day is ${exDay}`, () => expect(r.day).toEqual(exDay))
        test(`dayOfWeek is ${exDayOfWeek}`, () => expect(r.dayOfWeek).toEqual(exDayOfWeek))
        test(`week is ${exWeek}`, () => expect(r.week).toEqual(exWeek))
        test(`month is ${exMonth}`, () => expect(r.month).toEqual(exMonth))
        test(`datesExpected is ${exDatesExcepted}`, () => expect(r.datesExcepted).toEqual(exDatesExcepted))
        test(`lastDate is ${exLastDate}`, () => expect(r.lastDate ? r.lastDate.format(FORMAT) : "").toEqual(exLastDate))
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
        test(`datesExpected is ${exDatesExcepted}`, () =>
            expect(r.datesExcepted.map(x => x.format(FORMAT))).toEqual(exDatesExcepted))
    }
)

import {inTheDay, isFriDay, isMonDay, isThursDay, isTuesDay, isWednesDay, isWeekDay, toStartDayOfWeek} from "./DateUtil"
import {Moment} from "moment"
import * as moment from "moment"
import {Repetition} from "../models/Repetition"
import Task from "../models/Task"

const FORMAT = "YYYY/M/D"
const d = (v: string): Moment => moment(v, FORMAT)
const createTask = (dueDate: Moment, repetition: Repetition): Task =>
    ({
        id: null,
        dayOrder: null,
        itemOrder: null,

        icon: ":smile:",
        color: "rgba(150, 150, 150, 0.1)",
        isMilestone: false,
        isSeal: false,
        repetition: repetition,

        name: "Task",
        projectName: "Project",
        dueDate: dueDate,
        estimatedMinutes: 15,
        size: null,
    })

describe.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${true}
${"2018/07/24"} | ${"Tuesday"}   | ${true}
${"2018/07/25"} | ${"Wednesday"} | ${true}
${"2018/07/26"} | ${"Thursday"}  | ${true}
${"2018/07/27"} | ${"Friday"}    | ${true}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("isWeekDay returns", ({date, dayOfWeek, expected}) => {
    test(`${expected} if ${dayOfWeek}`, () => expect(isWeekDay(d(date))).toEqual(expected))
})

describe.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${true}
${"2018/07/24"} | ${"Tuesday"}   | ${false}
${"2018/07/25"} | ${"Wednesday"} | ${false}
${"2018/07/26"} | ${"Thursday"}  | ${false}
${"2018/07/27"} | ${"Friday"}    | ${false}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("isMonday returns", ({date, dayOfWeek, expected}) => {
    test(`${expected} if ${dayOfWeek}`, () => expect(isMonDay(d(date))).toEqual(expected))
})

describe.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${false}
${"2018/07/24"} | ${"Tuesday"}   | ${true}
${"2018/07/25"} | ${"Wednesday"} | ${false}
${"2018/07/26"} | ${"Thursday"}  | ${false}
${"2018/07/27"} | ${"Friday"}    | ${false}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("isTuesDay returns", ({date, dayOfWeek, expected}) => {
    test(`${expected} if ${dayOfWeek}`, () => expect(isTuesDay(d(date))).toEqual(expected))
})

describe.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${false}
${"2018/07/24"} | ${"Tuesday"}   | ${false}
${"2018/07/25"} | ${"Wednesday"} | ${true}
${"2018/07/26"} | ${"Thursday"}  | ${false}
${"2018/07/27"} | ${"Friday"}    | ${false}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("isWednesDay returns", ({date, dayOfWeek, expected}) => {
    test(`${expected} if ${dayOfWeek}`, () => expect(isWednesDay(d(date))).toEqual(expected))
})

describe.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${false}
${"2018/07/24"} | ${"Tuesday"}   | ${false}
${"2018/07/25"} | ${"Wednesday"} | ${false}
${"2018/07/26"} | ${"Thursday"}  | ${true}
${"2018/07/27"} | ${"Friday"}    | ${false}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("isThursDay returns", ({date, dayOfWeek, expected}) => {
    test(`${expected} if ${dayOfWeek}`, () => expect(isThursDay(d(date))).toEqual(expected))
})

describe.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${false}
${"2018/07/24"} | ${"Tuesday"}   | ${false}
${"2018/07/25"} | ${"Wednesday"} | ${false}
${"2018/07/26"} | ${"Thursday"}  | ${false}
${"2018/07/27"} | ${"Friday"}    | ${true}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("isFriDay returns", ({date, dayOfWeek, expected}) => {
    test(`${expected} if ${dayOfWeek}`, () => expect(isFriDay(d(date))).toEqual(expected))
})

describe.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${"2018/7/22"}
${"2018/07/23"} | ${"Monday"}    | ${"2018/7/22"}
${"2018/07/24"} | ${"Tuesday"}   | ${"2018/7/22"}
${"2018/07/25"} | ${"Wednesday"} | ${"2018/7/22"}
${"2018/07/26"} | ${"Thursday"}  | ${"2018/7/22"}
${"2018/07/27"} | ${"Friday"}    | ${"2018/7/22"}
${"2018/07/28"} | ${"Saturday"}  | ${"2018/7/22"}
`("toStartDayOfWeek returns", ({date, dayOfWeek, expected}) => {
    test(`${expected} if ${dayOfWeek}(${date})`, () => expect(toStartDayOfWeek(d(date)).format(FORMAT)).toEqual(expected))
})

describe.each`
description                | date            | dueDate         |  repDay        | repDayOfWeek               | repWeek          | repMonth      | repDatesExcepted   | expected
${"dueDate"}               | ${"2018/07/22"} | ${"2018/07/22"} | ${[]}          | ${[]}                      | ${[]}            | ${[]}         | ${[]}              | ${true}
${"dayOfWeek"}             | ${"2018/07/22"} | ${"2018/01/01"} | ${"every"}     | ${[0, 1]}                  | ${"every"}       | ${"every"}    | ${[]}              | ${true}
${"excepted dates"}        | ${"2018/07/22"} | ${"2018/01/01"} | ${"every"}     | ${[0, 1]}                  | ${"every"}       | ${"every"}    | ${["2018/07/22"]}  | ${false}
${"dayOfWeek"}             | ${"2018/07/24"} | ${"2018/01/01"} | ${"every"}     | ${[0, 1]}                  | ${"every"}       | ${"every"}    | ${[]}              | ${false}
${"dayOfWeek every other"} | ${"2018/07/22"} | ${"2018/07/14"} | ${"every"}     | ${[0, 1]}                  | ${"every other"} | ${"every"}    | ${[]}              | ${true}
${"dayOfWeek every other"} | ${"2018/07/22"} | ${"2018/07/20"} | ${"every"}     | ${[0, 1]}                  | ${"every other"} | ${"every"}    | ${[]}              | ${false}
${"day"}                   | ${"2018/07/21"} | ${"2018/01/01"} | ${[2, 22]}     | ${[0, 1, 2, 3, 4, 5, 6]}   | ${"every"}       | ${"every"}    | ${[]}              | ${false}
${"day"}                   | ${"2018/07/22"} | ${"2018/01/01"} | ${[2, 22]}     | ${[0, 1, 2, 3, 4, 5, 6]}   | ${"every"}       | ${"every"}    | ${[]}              | ${true}
`("inTheDay returns", ({description, date, dueDate, repDay, repDayOfWeek, repWeek, repMonth, repDatesExcepted, expected}) => {
    const repetition: Repetition = new Repetition({
        day: repDay,
        dayOfWeek: repDayOfWeek,
        week: repWeek,
        month: repMonth,
        datesExcepted: repDatesExcepted.map(d),
    })
    const task: Task = createTask(d(dueDate), repetition)

    test(`${expected ? "Match" : "No match"} ${description}`, () => expect(inTheDay(task, d(date))).toEqual(expected))
})

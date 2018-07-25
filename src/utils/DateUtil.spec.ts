import { isFriDay, isMonDay, isThursDay, isTuesDay, isWednesDay, isWeekDay, toStartDayOfWeek } from "./DateUtil"
import { Moment } from "moment"
import * as moment from "moment"

const FORMAT = "YYYY/M/D"
const d = (v: string): Moment => moment(v, FORMAT)

describe.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${true}
${"2018/07/24"} | ${"Tuesday"}   | ${true}
${"2018/07/25"} | ${"Wednesday"} | ${true}
${"2018/07/26"} | ${"Thursday"}  | ${true}
${"2018/07/27"} | ${"Friday"}    | ${true}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("isWeekDay returns", ({ date, dayOfWeek, expected }) => {
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
`("isMonday returns", ({ date, dayOfWeek, expected }) => {
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
`("isTuesDay returns", ({ date, dayOfWeek, expected }) => {
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
`("isWednesDay returns", ({ date, dayOfWeek, expected }) => {
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
`("isThursDay returns", ({ date, dayOfWeek, expected }) => {
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
`("isFriDay returns", ({ date, dayOfWeek, expected }) => {
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
`("toStartDayOfWeek returns", ({ date, dayOfWeek, expected }) => {
    test(`${expected} if ${dayOfWeek}(${date})`, () => expect(toStartDayOfWeek(d(date)).format(FORMAT)).toEqual(expected))
})

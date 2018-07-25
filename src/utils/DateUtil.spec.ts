import { isFriDay, isMonDay, isThursDay, isTuesDay, isWednesDay, isWeekDay, toStartDayOfWeek } from "./DateUtil"
import { Moment } from "moment"
import * as moment from "moment"

const FORMAT = "YYYY/M/D"
const d = (v: string): Moment => moment(v, FORMAT)

test.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${true}
${"2018/07/24"} | ${"Tuesday"}   | ${true}
${"2018/07/25"} | ${"Wednesday"} | ${true}
${"2018/07/26"} | ${"Thursday"}  | ${true}
${"2018/07/27"} | ${"Friday"}    | ${true}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("[isWeekDay] $expected if $dayOfWeek", ({ date, expected }) => expect(isWeekDay(d(date))).toEqual(expected))

test.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${true}
${"2018/07/24"} | ${"Tuesday"}   | ${false}
${"2018/07/25"} | ${"Wednesday"} | ${false}
${"2018/07/26"} | ${"Thursday"}  | ${false}
${"2018/07/27"} | ${"Friday"}    | ${false}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("[isMonDay] $expected if $dayOfWeek", ({ date, expected }) => expect(isMonDay(d(date))).toEqual(expected))

test.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${false}
${"2018/07/24"} | ${"Tuesday"}   | ${true}
${"2018/07/25"} | ${"Wednesday"} | ${false}
${"2018/07/26"} | ${"Thursday"}  | ${false}
${"2018/07/27"} | ${"Friday"}    | ${false}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("[isTuesDay] $expected if $dayOfWeek", ({ date, expected }) => expect(isTuesDay(d(date))).toEqual(expected))

test.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${false}
${"2018/07/24"} | ${"Tuesday"}   | ${false}
${"2018/07/25"} | ${"Wednesday"} | ${true}
${"2018/07/26"} | ${"Thursday"}  | ${false}
${"2018/07/27"} | ${"Friday"}    | ${false}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("[isWednesDay] $expected if $dayOfWeek", ({ date, expected }) => expect(isWednesDay(d(date))).toEqual(expected))

test.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${false}
${"2018/07/24"} | ${"Tuesday"}   | ${false}
${"2018/07/25"} | ${"Wednesday"} | ${false}
${"2018/07/26"} | ${"Thursday"}  | ${true}
${"2018/07/27"} | ${"Friday"}    | ${false}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("[isThursDay] $expected if $dayOfWeek", ({ date, expected }) => expect(isThursDay(d(date))).toEqual(expected))

test.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${false}
${"2018/07/23"} | ${"Monday"}    | ${false}
${"2018/07/24"} | ${"Tuesday"}   | ${false}
${"2018/07/25"} | ${"Wednesday"} | ${false}
${"2018/07/26"} | ${"Thursday"}  | ${false}
${"2018/07/27"} | ${"Friday"}    | ${true}
${"2018/07/28"} | ${"Saturday"}  | ${false}
`("[isFriDay] $expected if $dayOfWeek", ({ date, expected }) => expect(isFriDay(d(date))).toEqual(expected))

test.each`
date            | dayOfWeek      | expected
${"2018/07/22"} | ${"Sunday"}    | ${"2018/7/22"}
${"2018/07/23"} | ${"Monday"}    | ${"2018/7/22"}
${"2018/07/24"} | ${"Tuesday"}   | ${"2018/7/22"}
${"2018/07/25"} | ${"Wednesday"} | ${"2018/7/22"}
${"2018/07/26"} | ${"Thursday"}  | ${"2018/7/22"}
${"2018/07/27"} | ${"Friday"}    | ${"2018/7/22"}
${"2018/07/28"} | ${"Saturday"}  | ${"2018/7/22"}
`("[toStartDayOfWeek] Sunday if $dayOfWeek", ({ date, expected }) => {
    expect(toStartDayOfWeek(d(date)).format(FORMAT)).toEqual(expected)
})

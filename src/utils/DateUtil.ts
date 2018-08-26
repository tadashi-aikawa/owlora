import * as _ from "lodash"
import { Moment } from "moment"
import Task from "../models/Task"
import { SIMPLE_FORMAT } from "../storage/settings"
import { Pattern } from "../models/Repetition"

export const isWeekDay = (date: Moment): boolean => date.day() > 0 && date.day() < 6
export const isMonDay = (date: Moment): boolean => date.day() === 1
export const isTuesDay = (date: Moment): boolean => date.day() === 2
export const isWednesDay = (date: Moment): boolean => date.day() === 3
export const isThursDay = (date: Moment): boolean => date.day() === 4
export const isFriDay = (date: Moment): boolean => date.day() === 5

export const toStartMonth = (date: Moment): Moment => date.clone().startOf("month")
export const toStartDayOfWeek = (date: Moment): Moment => date.clone().startOf("week")
export const plusDays = (date: Moment, days: number): Moment => date.clone().add(days, "day")

function isNumberArray(arg: any): arg is number[] {
    return arg !== "every" && arg !== "every other"
}

export const getTh = (date: Moment): number => {
    const d: Moment = toStartMonth(date)
    let cnt: number = 0
    while (d.format(SIMPLE_FORMAT) !== date.format(SIMPLE_FORMAT)) {
        if (d.day() === date.day()) {
            cnt += 1
        }
        d.add(1, "day")
    }

    return cnt + 1
}

export const inTheDay = (task: Task, date: Moment): boolean => {
    if (!task.dueDate) {
        return false
    }

    if (task.repetition && task.repetition.datesExcepted.some(d => d.isSame(date, "date"))) {
        return false
    }

    if (task.repetition && task.repetition.lastDate && task.repetition.lastDate.isBefore(date)) {
        return false
    }

    if (date.format(SIMPLE_FORMAT) === task.dueDate.format(SIMPLE_FORMAT)) {
        return true
    }

    if (!task.repetition || !date.isSameOrAfter(task.dueDate)) {
        return false
    }

    if (!_.includes<number>(task.repetition.dayOfWeek, date.day())) {
        return false
    }

    const behindWeek: number = toStartDayOfWeek(date).diff(toStartDayOfWeek(task.dueDate), "week")
    if (task.repetition.week === "every other" && behindWeek % 2 !== 0) {
        return false
    }

    if (isNumberArray(task.repetition.week) && !_.includes<number>(task.repetition.week, getTh(date))) {
        return false
    }

    const td: number[] | "every" = task.repetition.day
    if (td !== "every" && !_.includes<number>(td, date.date())) {
        return false
    }

    return true
}

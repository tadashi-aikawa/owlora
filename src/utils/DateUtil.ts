import * as _ from 'lodash'
import { Moment } from "moment"
import Task from "../models/Task"
import { SIMPLE_FORMAT } from "../storage/settings"

export const isWeekDay = (date: Moment): boolean => date.day() > 0 && date.day() < 6
export const isMonDay = (date: Moment): boolean => date.day() === 1
export const isTuesDay = (date: Moment): boolean => date.day() === 2
export const isWednesDay = (date: Moment): boolean => date.day() === 3
export const isThursDay = (date: Moment): boolean => date.day() === 4
export const isFriDay = (date: Moment): boolean => date.day() === 5

export const toStartDayOfWeek = (date: Moment): Moment => date.clone().startOf("week")
export const plusDays = (date: Moment, days: number): Moment => date.clone().add(days, "day")

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

    const td: number[] | 'every' = task.repetition.day
    if (td !== "every" && !_.includes<number>(td, date.date())) {
        return false
    }

    return true
}

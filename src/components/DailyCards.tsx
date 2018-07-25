import * as React from "react"
import { Dictionary } from "lodash"
import { Card, SemanticWIDTHS } from "semantic-ui-react"
import { Moment } from "moment"
import Task, { TaskUpdateParameter } from "../models/Task"
import DailyCard from "./DailyCard"
import TaskSortField from "../constants/TaskSortField"
import Order from "../constants/Order"
import Filter from "../models/Filter"
import * as DateUtil from "../utils/DateUtil"
import { plusDays, toStartDayOfWeek } from "../utils/DateUtil"

function* momentIterator(begin: Moment, filter: (m: Moment) => boolean, max: number): IterableIterator<Moment> {
    let i = 0
    let count = 0

    while (count < max) {
        const m = plusDays(begin, i)
        if (filter(m)) {
            yield m
            count++
        }
        i++
    }
}

export interface DailyCardsProps {
    baseDate: Moment
    tasks: Task[]
    taskSortField: TaskSortField
    taskOrder: Order
    timeLamps: boolean
    milestone: boolean
    seal: boolean
    warning: boolean
    isTasksExpanded: boolean
    minutesToUsePerDay: number
    minutesToUsePerSpecificDays: Dictionary<number>
    numberOfCards: number
    numberOfCardsPerRow: SemanticWIDTHS
    onlyWeekday: boolean
    filter?: Filter

    onUpdateTask: (parameter: TaskUpdateParameter) => void
    onRemoveTask: (id: number) => void
}

export const DailyCards = (props: DailyCardsProps) => {
    const dates: Moment[] = Array.from(
        momentIterator(
            toStartDayOfWeek(props.baseDate),
            props.onlyWeekday ? DateUtil.isWeekDay : () => true,
            props.numberOfCards
        )
    )

    return (
        <Card.Group itemsPerRow={props.numberOfCardsPerRow}>
            {dates.map((date: Moment) => (
                <DailyCard
                    key={date.toString()}
                    date={date}
                    tasks={props.tasks.filter(t => DateUtil.inTheDay(t, date))}
                    taskSortField={props.taskSortField}
                    taskOrder={props.taskOrder}
                    timeLamps={props.timeLamps}
                    milestone={props.milestone}
                    seal={props.seal}
                    warning={props.warning}
                    isTasksExpanded={props.isTasksExpanded}
                    minutesToUsePerDay={props.minutesToUsePerDay}
                    minutesToUsePerSpecificDays={props.minutesToUsePerSpecificDays}
                    filter={props.filter}
                    past={date.isBefore(props.baseDate, "day")}
                    onUpdateTask={props.onUpdateTask}
                    onRemoveTask={props.onRemoveTask}
                />
            ))}
        </Card.Group>
    )
}

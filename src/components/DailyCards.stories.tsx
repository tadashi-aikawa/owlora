import * as _ from "lodash"
import * as React from "react"

import {storiesOf} from "@storybook/react"
import {action} from "@storybook/addon-actions"

import Task from "../models/Task"
import * as Moment from "moment"
import {boolean, number, object, select, text, withKnobs} from "@storybook/addon-knobs"
import DnDWrapper from "./DnDWrapper"
import {DailyCards} from "./DailyCards"
import TaskSortField from "../constants/TaskSortField"
import Order from "../constants/Order"
import {Repetition} from "../models/Repetition"
import moment = require("moment")

const DnDWrapperDecorator = storyFn => <DnDWrapper>{storyFn()}</DnDWrapper>

const toDate = (v: string) => Moment(v, "YYYY/MM/DD")
const CoolPaddingDecorator = storyFn => <div style={{ padding: 20 }}>{storyFn()}</div>
const createTask = (properties): Task =>
    _.assign(
        {},
        {
            id: null,
            dayOrder: null,

            icon: ":smile:",
            color: "rgba(150, 150, 150, 0.1)",
            isMilestone: false,
            isSeal: false,

            name: "Task",
            projectName: "Project",
            dueDate: toDate("2099/01/01"),
            estimatedMinutes: 15,
            dateString: "",
        },
        properties
    )

storiesOf("DailyCards", module)
    .addDecorator(DnDWrapperDecorator)
    .addDecorator(withKnobs)
    .addDecorator(CoolPaddingDecorator)
    .add("Summary", () => (
        <DailyCards
            baseDate={toDate(text("baseDate", "2149/01/02"))}
            tasks={[
                createTask({ id: 1, name: "Task1", dayOrder: 1, dueDate: toDate("2149/01/01") }),
                createTask({ id: 2, name: "Task2", dayOrder: 2, dueDate: toDate("2149/01/02") }),
                createTask({ id: 3, name: "Task3", dayOrder: 3, dueDate: toDate("2149/01/03") }),
                createTask({ id: 4, name: "Task4", dayOrder: 4, dueDate: toDate("2149/01/03") }),
                createTask({ id: 5, name: "Task5", dayOrder: 5, dueDate: toDate("2149/01/04") }),
                createTask({ id: 6, name: "Task6", dayOrder: 6, dueDate: toDate("2149/01/05") }),
                createTask({ id: 7, name: "Task7", dayOrder: 7, dueDate: toDate("2149/01/06"), icon: ":innocent:" }),
                createTask({ id: 8, name: "Task8", dayOrder: 8, dueDate: toDate("2149/01/07"), icon: ":innocent:" }),
            ]}
            taskSortField={TaskSortField.DAY_ORDER}
            taskOrder={Order.ASC}
            timeLamps={false}
            milestone={false}
            seal={false}
            warning={false}
            isTasksExpanded
            minutesToUsePerDay={300}
            minutesToUsePerSpecificDays={{}}
            numberOfCards={number("numberOfCards", 10)}
            numberOfCardsPerRow={number("numberOfCardsPerRow", 5)}
            onlyWeekday={boolean("onlyWeekday", false)}
            onUpdateTask={action}
            onRemoveTask={action}
        />
    ))
    .add("Filter", () => (
        <DailyCards
            baseDate={toDate("2149/01/01")}
            tasks={[
                createTask({ id: 1, name: "Task1", dayOrder: 1, dueDate: toDate("2149/01/01") }),
                createTask({ id: 2, name: "Task2", dayOrder: 2, dueDate: toDate("2149/01/02") }),
                createTask({ id: 3, name: "Task3", dayOrder: 3, dueDate: toDate("2149/01/03") }),
                createTask({ id: 4, name: "Task4", dayOrder: 4, dueDate: toDate("2149/01/03") }),
                createTask({ id: 5, name: "Task5", dayOrder: 5, dueDate: toDate("2149/01/04") }),
                createTask({ id: 6, name: "Task6", dayOrder: 6, dueDate: toDate("2149/01/05") }),
                createTask({ id: 7, name: "Task7", dayOrder: 7, dueDate: toDate("2149/01/06"), icon: ":innocent:" }),
                createTask({ id: 8, name: "Task8", dayOrder: 8, dueDate: toDate("2149/01/07"), icon: ":innocent:" }),
            ]}
            taskSortField={TaskSortField.DAY_ORDER}
            taskOrder={Order.ASC}
            timeLamps={false}
            milestone={false}
            seal={false}
            warning={false}
            isTasksExpanded
            minutesToUsePerDay={300}
            minutesToUsePerSpecificDays={{}}
            numberOfCards={10}
            numberOfCardsPerRow={5}
            onlyWeekday={false}
            filter={object("filter", {
                iconDisabledMap: {
                    ":innocent:": true,
                },
                word: "Task[3-8]",
            })}
            onUpdateTask={action}
            onRemoveTask={action}
        />
    ))
    .add("Except dates", () => (
        <DailyCards
            baseDate={toDate("2149/01/01")}
            tasks={[
                createTask({
                    id: 1,
                    name: "Every day [x1/2][x1/4]",
                    dayOrder: 1,
                    dueDate: toDate("2149/01/01"),
                    repetition: Repetition.everyDay.addDatesExcepted([
                        moment("2149/01/02", "YYYY/M/D"),
                        moment("2149/01/04", "YYYY/M/D"),
                    ]),
                }),
                createTask({
                    id: 2,
                    name: "Every week day 1/3- [x1/7][x1/8]",
                    dayOrder: 2,
                    dueDate: toDate("2149/01/03"),
                    repetition: Repetition.everyWeekDay.addDatesExcepted([
                        moment("2149/01/07", "YYYY/M/D"),
                        moment("2149/01/08", "YYYY/M/D"),
                    ]),
                }),
            ]}
            taskSortField={TaskSortField.DAY_ORDER}
            taskOrder={Order.ASC}
            timeLamps={false}
            milestone={false}
            seal={false}
            warning={false}
            isTasksExpanded
            minutesToUsePerDay={300}
            minutesToUsePerSpecificDays={{}}
            numberOfCards={10}
            numberOfCardsPerRow={5}
            onlyWeekday={false}
            onUpdateTask={action}
            onRemoveTask={action}
        />
    ))
    .add("Last date", () => (
        <DailyCards
            baseDate={toDate("2149/01/01")}
            tasks={[
                createTask({
                    id: 1,
                    name: "Every day [x1/4] to 1/6",
                    dayOrder: 1,
                    dueDate: toDate("2149/01/01"),
                    repetition: Repetition.everyDay
                        .addDatesExcepted([moment("2149/01/04", "YYYY/M/D")])
                        .addLastDate(moment("2149/01/06", "YYYY/M/D")),
                }),
            ]}
            taskSortField={TaskSortField.DAY_ORDER}
            taskOrder={Order.ASC}
            timeLamps={false}
            milestone={false}
            seal={false}
            warning={false}
            isTasksExpanded
            minutesToUsePerDay={300}
            minutesToUsePerSpecificDays={{}}
            numberOfCards={10}
            numberOfCardsPerRow={5}
            onlyWeekday={false}
            onUpdateTask={action}
            onRemoveTask={action}
        />
    ))

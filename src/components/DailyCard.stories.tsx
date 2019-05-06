import * as _ from "lodash";
import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Card } from "semantic-ui-react";

import Task from "../models/Task";
import TaskSortField from "../constants/TaskSortField";
import Order from "../constants/Order";
import * as Moment from "moment";
import DailyCard from "../components/DailyCard";
import { boolean, number, object, select, text, withKnobs } from "@storybook/addon-knobs";
import DnDWrapper from "./DnDWrapper";
import Size from "../constants/Size";

const DnDWrapperDecorator = storyFn => <DnDWrapper>{storyFn()}</DnDWrapper>;

const toDate = (v: string) => Moment(v, "YYYY/MM/DD");
const toDateTime = (v: string) => Moment(v, "YYYY/MM/DD H:mm");
const CoolPaddingDecorator = storyFn => <div style={{ padding: 20 }}>{storyFn()}</div>;
const createTask = (properties): Task =>
    _.assign(
        {},
        {
            id: null,
            itemOrder: null,
            dayOrder: null,

            icon: ":innocent:",
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
    );

storiesOf("DailyCard", module)
    .addDecorator(DnDWrapperDecorator)
    .addDecorator(withKnobs)
    .addDecorator(CoolPaddingDecorator)
    .add("Summary", () => (
        <DailyCard
            date={toDate(text("Date", "2099/01/01"))}
            taskSortField={select("Task sort field", TaskSortField.toObject, TaskSortField.PROJECT_NAME)}
            taskOrder={select("Task order", Order.toObject, Order.ASC)}
            minutesToUsePerDay={number("Minutes to use per day", 300)}
            minutesToUsePerSpecificDays={{}}
            filter={{ iconDisabledMap: {} }}
            tasks={[
                createTask({ id: 1, name: "Task1", itemOrder: 3, dayOrder: 3, icon: ":person_with_pouting_face:" }),
                createTask({
                    id: 2,
                    name: "Task2 this is long name task hogehoge!! (11:00-12:00)",
                    itemOrder: 1,
                    dayOrder: 2,
                    icon: ":whale:",
                    time: {
                        start: toDateTime("2099/01/01 11:00"),
                        end: toDateTime("2099/01/01 12:00"),
                    },
                }),
                createTask({
                    id: 3,
                    name: "Task3 (13:30-16:15)",
                    itemOrder: 2,
                    dayOrder: 1,
                    icon: ":japan:",
                    color: "rgba(200, 50, 50, 0.1)",
                    time: {
                        start: toDateTime("2099/01/01 13:30"),
                        end: toDateTime("2099/01/01 16:15"),
                    },
                }),
                createTask({
                    id: 4,
                    name: "Milestone",
                    itemOrder: 4,
                    dayOrder: 4,
                    estimatedMinutes: undefined,
                    color: "rgba(50, 50, 200, 0.1)",
                    milestoneColor: "blue",
                    isMilestone: true,
                }),
                createTask({
                    id: 5,
                    name: "Both Milestone and Task",
                    dayOrder: 5,
                    color: "rgba(240, 160, 50, 0.1)",
                    milestoneColor: "orange",
                    isMilestone: true,
                }),
                createTask({
                    id: 6,
                    name: ":wine_glass: Seal",
                    dayOrder: 6,
                    estimatedMinutes: undefined,
                    color: "pink",
                    isSeal: true,
                }),
            ]}
            timeLamps={boolean("timeLamps", true)}
            lampTime={{begin: number("lampTime.begin", 9), end: number("lampTime.end", 18)}}
            milestone={boolean("milestone", true)}
            seal={boolean("seal", true)}
            warning={boolean("warning", true)}
            isTasksExpanded={boolean("isTasksExpanded", true)}
            onUpdateTask={action}
            onRemoveTask={action}
        />
    ))
    .add("Appearance", () => (
        <Card.Group>
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={{ iconDisabledMap: {} }}
                tasks={[
                    createTask({ id: 1, dayOrder: 1, icon: ":innocent:" }),
                    createTask({
                        id: 2,
                        name: "Milestone",
                        dayOrder: 2,
                        estimatedMinutes: undefined,
                        milestoneColor: "purple",
                        isMilestone: true,
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded={boolean("(1)isTasksExpanded", false)}
                onUpdateTask={action}
                onRemoveTask={action}
            />
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={{ iconDisabledMap: {} }}
                tasks={[
                    createTask({ id: 1, dayOrder: 1, icon: ":innocent:" }),
                    createTask({
                        id: 2,
                        name: "Milestone",
                        dayOrder: 2,
                        estimatedMinutes: undefined,
                        milestoneColor: "purple",
                        isMilestone: true,
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded={boolean("(2)isTasksExpanded", true)}
                onUpdateTask={action}
                onRemoveTask={action}
            />
        </Card.Group>
    ))
    .add("Sort", () => {
        const tasks: Task[] = [
            createTask({ id: 1, name: "Task1", projectName: "PJ2", dayOrder: 3, estimatedMinutes: 10, icon: ":bow:" }),
            createTask({
                id: 2,
                name: "Task2 (11:00-11:50)",
                projectName: "PJ1",
                dayOrder: 2,
                estimatedMinutes: 50,
                icon: ":whale:",
                time: {
                    start: toDateTime(text("(1)time.start", "2099/01/01 11:00")),
                    end: toDateTime(text("(1)time.end", "2099/01/01 11:50")),
                },
            }),
            createTask({
                id: 3,
                name: "Task3 (17:15-17:35)",
                projectName: "PJ3",
                dayOrder: 1,
                estimatedMinutes: 20,
                icon: ":whale:",
                time: {
                    start: toDateTime(text("(1)time.start", "2099/01/01 17:15")),
                    end: toDateTime(text("(1)time.end", "2099/01/01 17:35")),
                },
            }),
            createTask({
                id: 4,
                name: "Both Milestone and Task (17:00-18:40)",
                dayOrder: 4,
                estimatedMinutes: 100,
                color: "rgba(230, 50, 230, 0.1)",
                milestoneColor: "purple",
                isMilestone: true,
                time: {
                    start: toDateTime(text("(1)time.start", "2099/01/01 17:00")),
                    end: toDateTime(text("(1)time.end", "2099/01/01 18:40")),
                },
            }),
        ];

        return (
            <Card.Group>
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={select("Sort by project", TaskSortField.toObject, TaskSortField.PROJECT_NAME)}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={tasks}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={select("Sort by day order", TaskSortField.toObject, TaskSortField.DAY_ORDER)}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={tasks}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={select(
                        "Sort by estimated minutes",
                        TaskSortField.toObject,
                        TaskSortField.ESTIMATED_MINUTES
                    )}
                    taskOrder={Order.DESC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={tasks}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={select("Sort by task name", TaskSortField.toObject, TaskSortField.TASK_NAME)}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={tasks}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={select("Sort by task start time", TaskSortField.toObject, TaskSortField.START_TIME)}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={tasks}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
            </Card.Group>
        );
    })
    .add("Time lamps", () => {
        return (
            <Card.Group>
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.TASK_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            name: "Task1 (11:00-12:00)",
                            time: {
                                start: toDateTime(text("(1)time.start", "2099/01/01 11:00")),
                                end: toDateTime(text("(1)time.end", "2099/01/01 12:00")),
                            },
                        }),
                    ]}
                    isTasksExpanded
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.TASK_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            name: "Task1 (11:00-12:00)",
                            time: {
                                start: toDateTime(text("(2)Task1: time.start", "2099/01/01 11:00")),
                                end: toDateTime(text("(2)Task1: time.end", "2099/01/01 12:00")),
                            },
                        }),
                        createTask({
                            id: 2,
                            name: "Task2 (14:15-17:15)",
                            time: {
                                start: toDateTime(text("(2)Task2: time.start", "2099/01/01 14:15")),
                                end: toDateTime(text("(2)Task2: time.end", "2099/01/01 17:15")),
                            },
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.TASK_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            name: "Task1 (16:00-16:15)",
                            time: {
                                start: toDateTime(text("(3)Task1: time.start", "2099/01/01 16:00")),
                                end: toDateTime(text("(3)Task1: time.end", "2099/01/01 16:15")),
                            },
                        }),
                        createTask({
                            id: 2,
                            name: "Task2 (15:00-17:00)",
                            time: {
                                start: toDateTime(text("(3)Task2: time.start", "2099/01/01 15:00")),
                                end: toDateTime(text("(3)Task2: time.end", "2099/01/01 17:00")),
                            },
                        }),
                    ]}
                    isTasksExpanded
                    timeLamps
                    lampTime={{begin: number("(3)lampTime.begin", 9), end: number("(3)lampTime.end", 18)}}
                    milestone
                    seal
                    warning
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.TASK_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            name: "Task1 (11:00-12:00)",
                            time: {
                                start: toDateTime("2099/01/01 11:00"),
                                end: toDateTime("2099/01/01 12:00"),
                            },
                        }),
                    ]}
                    isTasksExpanded
                    timeLamps={boolean("(4)Time lamps is enabled", false)}
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
            </Card.Group>
        );
    })
    .add("Feed icon", () => (
        <Card.Group>
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={{ iconDisabledMap: {} }}
                tasks={[
                    createTask({
                        id: 1,
                        dayOrder: 1,
                        icon: text("task.icon (emoji)", ":innocent:"),
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded
                onUpdateTask={action}
                onRemoveTask={action}
            />
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={{ iconDisabledMap: {} }}
                tasks={[
                    createTask({
                        id: 1,
                        dayOrder: 1,
                        icon: text("task.icon (url)", "https://avatars1.githubusercontent.com/u/9500018?s=460&v=4"),
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded
                onUpdateTask={action}
                onRemoveTask={action}
            />
        </Card.Group>
    ))
    .add("Feed color", () => (
        <Card.Group>
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={{ iconDisabledMap: {} }}
                tasks={[
                    createTask({
                        id: 1,
                        dayOrder: 1,
                        color: text("task.color (name)", "pink"),
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded
                onUpdateTask={action}
                onRemoveTask={action}
            />
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={{ iconDisabledMap: {} }}
                tasks={[
                    createTask({
                        id: 1,
                        dayOrder: 1,
                        color: text("task.color (rgb)", "#7777CC"),
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded
                onUpdateTask={action}
                onRemoveTask={action}
            />
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={{ iconDisabledMap: {} }}
                tasks={[
                    createTask({
                        id: 1,
                        dayOrder: 1,
                        color: text("task.color (rgba)", "rgba(200, 50, 50, 0.2)"),
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded
                onUpdateTask={action}
                onRemoveTask={action}
            />
        </Card.Group>
    ))
    .add("Milestone", () => (
            <Card.Group>
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            name: ":beer: Milestone without estimated!!",
                            dayOrder: 1,
                            estimatedMinutes: undefined,
                            milestoneColor: text("(1)task.milestoneColor", "purple"),
                            size: select("(1)task.size", Size.toObject, Size.LARGE),
                            isMilestone: boolean("(1)task.isMilestone", true),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            name: ":beer: Milestone with estimated!! (11:00-12:00)",
                            dayOrder: 1,
                            color: text("(2)task.color", "rgba(200, 50, 200, 0.1)"),
                            milestoneColor: text("(2)task.milestoneColor", "purple"),
                            size: select("(2)task.size", Size.toObject, Size.LARGE),
                            isMilestone: boolean("(2)task.isMilestone", true),
                            time: {
                                start: toDateTime(text("(2)task.time.start", "2099/01/01 11:00")),
                                end: toDateTime(text("(2)task.time.end", "2099/01/01 12:00")),
                            },
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            name: ":beer: Milestone without estimated!!",
                            dayOrder: 1,
                            estimatedMinutes: undefined,
                            milestoneColor: text("(3)task.milestoneColor", "purple"),
                            size: select("(3)task.size", Size.toObject, Size.LARGE),
                            isMilestone: boolean("(3)task.isMilestone", true),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone={boolean("(3)Milestone is enabled", false)}
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
            </Card.Group>
    ))
    .add("Seal", () => (
            <Card.Group>
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            name: ":house: At home",
                            dayOrder: 1,
                            estimatedMinutes: undefined,
                            sealColor: text("(1)task.sealColor", "purple"),
                            isSeal: boolean("(1)task.isSeal", true),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={300}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            name: ":house: At home",
                            dayOrder: 1,
                            estimatedMinutes: undefined,
                            sealColor: text("(2)task.sealColor", "purple"),
                            isSeal: true,
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal={boolean("(2)Seal is enabled", false)}
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
            </Card.Group>
    ))
    .add("Warning", () => (
            <Card.Group>
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: 101,
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning={boolean("(1) warning", true)}
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: 101,
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning={boolean("(2) warning", false)}
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: 100,
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning={boolean("(3) warning", true)}
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: 100,
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning={boolean("(4) warning", false)}
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
            </Card.Group>
    ))
    .add("Life status", () => (
            <Card.Group>
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC} minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: number("task.estimatedMinutes (fine♥40)", 60),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: number("task.estimatedMinutes (warning♥39)", 61),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: number("task.estimatedMinutes (warning♥20)", 80),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: number("task.estimatedMinutes (danger♥19)", 81),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: number("task.estimatedMinutes (danger♥0)", 100),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
                <DailyCard
                    date={toDate("2099/01/01")}
                    taskSortField={TaskSortField.PROJECT_NAME}
                    taskOrder={Order.ASC}
                    minutesToUsePerDay={100}
                    minutesToUsePerSpecificDays={{}}
                    filter={{ iconDisabledMap: {} }}
                    tasks={[
                        createTask({
                            id: 1,
                            dayOrder: 1,
                            estimatedMinutes: number("task.estimatedMinutes (lack)", 101),
                        }),
                    ]}
                    timeLamps
                    lampTime={{begin: 10, end: 19}}
                    milestone
                    seal
                    warning
                    isTasksExpanded
                    onUpdateTask={action}
                    onRemoveTask={action}
                />
            </Card.Group>
    ))
    .add("Unknown estimates", () => (
        <Card.Group>
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={{ iconDisabledMap: {} }}
                tasks={[
                    createTask({
                        id: 1,
                        dayOrder: 1,
                        icon: ":smile:",
                        estimatedMinutes: number("0 means unknown", 0),
                    }),
                    createTask({
                        id: 2,
                        dayOrder: 2,
                        icon: ":angry:",
                        estimatedMinutes: 15,
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded
                onUpdateTask={action}
                onRemoveTask={action}
            />
        </Card.Group>
    ))
    .add("Filter", () => (
        <Card.Group>
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={object("filter (No filter)", {
                    iconDisabledMap: {},
                })}
                tasks={[
                    createTask({
                        id: 1,
                        name: "Internal operation",
                        dayOrder: 1,
                        icon: ":smile:",
                        time: {
                            start: toDateTime("2099/01/01 11:00"),
                            end: toDateTime("2099/01/01 12:00"),
                        },
                    }),
                    createTask({
                        id: 2,
                        name: "Project jobs1",
                        dayOrder: 2,
                        icon: ":angry:",
                        time: {
                            start: toDateTime("2099/01/01 12:00"),
                            end: toDateTime("2099/01/01 13:00"),
                        },
                    }),
                    createTask({
                        id: 3,
                        name: "Project jobs2",
                        dayOrder: 3,
                        icon: ":smile:",
                        time: {
                            start: toDateTime("2099/01/01 17:00"),
                            end: toDateTime("2099/01/01 18:00"),
                        },
                    }),
                    createTask({
                        id: 4,
                        name: "project",
                        dayOrder: 4,
                        icon: ":smile:",
                        time: {
                            start: toDateTime("2099/01/01 17:00"),
                            end: toDateTime("2099/01/01 18:00"),
                        },
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded
                onUpdateTask={action}
                onRemoveTask={action}
            />
            <DailyCard
                date={toDate("2099/01/01")}
                taskSortField={TaskSortField.PROJECT_NAME}
                taskOrder={Order.ASC}
                minutesToUsePerDay={300}
                minutesToUsePerSpecificDays={{}}
                filter={object("filter (icon and regexp(case insensitive))", {
                    iconDisabledMap: { ":angry:": true },
                    word: "proj..t",
                })}
                tasks={[
                    createTask({
                        id: 1,
                        name: "Internal operation",
                        dayOrder: 1,
                        icon: ":smile:",
                        time: {
                            start: toDateTime("2099/01/01 11:00"),
                            end: toDateTime("2099/01/01 12:00"),
                        },
                    }),
                    createTask({
                        id: 2,
                        name: "Project jobs1",
                        dayOrder: 2,
                        icon: ":angry:",
                        time: {
                            start: toDateTime("2099/01/01 12:00"),
                            end: toDateTime("2099/01/01 13:00"),
                        },
                    }),
                    createTask({
                        id: 3,
                        name: "Project jobs2",
                        dayOrder: 3,
                        icon: ":smile:",
                        time: {
                            start: toDateTime("2099/01/01 17:00"),
                            end: toDateTime("2099/01/01 18:00"),
                        },
                    }),
                    createTask({
                        id: 4,
                        name: "project",
                        dayOrder: 4,
                        icon: ":smile:",
                        time: {
                            start: toDateTime("2099/01/01 17:00"),
                            end: toDateTime("2099/01/01 18:00"),
                        },
                    }),
                ]}
                timeLamps
                lampTime={{begin: 10, end: 19}}
                milestone
                seal
                warning
                isTasksExpanded
                onUpdateTask={action}
                onRemoveTask={action}
            />
        </Card.Group>
    ))
    .add("Offtime", () => (
        <DailyCard
            date={toDate("2099/01/01")}
            taskSortField={TaskSortField.PROJECT_NAME}
            taskOrder={Order.ASC}
            minutesToUsePerDay={300}
            minutesToUsePerSpecificDays={object("minutesToUsePerSpecificDays", {
                "20990101": 0,
            })}
            filter={{ iconDisabledMap: {} }}
            tasks={[]}
            timeLamps
            lampTime={{begin: 10, end: 19}}
            milestone
            seal
            warning
            isTasksExpanded
            onUpdateTask={action}
            onRemoveTask={action}
        />
    ))
    .add("Past", () => (
        <DailyCard
            date={toDate(text("date", "2000/01/01"))}
            taskSortField={TaskSortField.PROJECT_NAME}
            taskOrder={Order.ASC}
            minutesToUsePerDay={300}
            minutesToUsePerSpecificDays={{}}
            filter={{ iconDisabledMap: {} }}
            tasks={[
                createTask({
                    id: 1,
                    dayOrder: 1,
                }),
            ]}
            timeLamps
            lampTime={{begin: 10, end: 19}}
            milestone
            seal
            warning
            isTasksExpanded
            onUpdateTask={action}
            onRemoveTask={action}
            past
        />
    ));

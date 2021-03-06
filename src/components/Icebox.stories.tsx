import * as _ from "lodash";
import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Task from "../models/Task";
import TaskSortField from "../constants/TaskSortField";
import Order from "../constants/Order";
import { number, object, select, withKnobs } from "@storybook/addon-knobs";
import Icebox from "./Icebox";
import DnDWrapper from "./DnDWrapper";

const DnDWrapperDecorator = storyFn => <DnDWrapper>{storyFn()}</DnDWrapper>;

const CoolPaddingDecorator = storyFn => <div style={{ padding: 20 }}>{storyFn()}</div>;
const createTask = (properties): Task =>
    _.assign(
        {},
        {
            id: null,
            dayOrder: null,

            icon: ":innocent:",
            color: "rgba(150, 150, 150, 0.1)",
            isMilestone: false,
            isSeal: false,

            name: "Task",
            projectName: "Project",
            dueDate: null,
            estimatedMinutes: 15,
            dateString: "",
        },
        properties
    );

storiesOf("Icebox", module)
    .addDecorator(DnDWrapperDecorator)
    .addDecorator(withKnobs)
    .addDecorator(CoolPaddingDecorator)
    .add("Summary", () => (
        <Icebox
            taskSortField={select("Task sort field", TaskSortField.toObject, TaskSortField.PROJECT_NAME)}
            taskOrder={select("Task order", Order.toObject, Order.ASC)}
            milestone
            seal
            tasks={object("Tasks", [
                createTask({ id: 1, name: "Task1", dayOrder: 3, icon: ":person_with_pouting_face:" }),
                createTask({
                    id: 2,
                    name: "Task2 this is long name task hogehoge!!",
                    dayOrder: 2,
                    icon: ":whale:",
                }),
                createTask({
                    id: 3,
                    name: "Task3",
                    dayOrder: 1,
                    icon: ":japan:",
                    color: "rgba(200, 50, 50, 0.1)",
                }),
                createTask({
                    id: 4,
                    name: "Milestone",
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
            ])}
            filter={{ iconDisabledMap: {} }}
            width={number("width", 350)}
            onUpdateTask={action}
            onRemoveTask={action}
        />
    ));

import * as React from 'react';
import * as _ from 'lodash';
import {Feed} from 'semantic-ui-react';
import Task, {TaskUpdateParameter} from '../models/Task';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import {DragSource, DropTarget} from 'react-dnd';
import TaskFeed, {TaskFeedState} from './TaskFeed';
import {Component} from "react";


// I want to use rich enum
const toSortFieldValue = (task: Task, sortField: TaskSortField) => {
    switch (sortField) {
        case TaskSortField.PROJECT_NAME:
            return task.projectName;
        case TaskSortField.DAY_ORDER:
            return task.dayOrder;
        case TaskSortField.TASK_NAME:
            return task.name;
        case TaskSortField.ESTIMATED_MINUTES:
            return task.estimatedMinutes;
        case TaskSortField.START_TIME:
            return task.time.start;
    }
};

interface TaskFeedsProps {
    tasks: Task[];
    taskSortField: TaskSortField;
    taskOrder: Order;

    onUpdateTask: (parameter: TaskUpdateParameter) => void;
    onRemoveTask: (id: number) => void;
}

const TaskFeeds = (props: TaskFeedsProps) =>
    <div>{
        _(props.tasks)
            .orderBy<Task>(t => t.itemOrder)
            .orderBy(t => toSortFieldValue(t, props.taskSortField), props.taskOrder)
            .map(t => (
                <TaskFeed key={t.id}
                          task={t}
                          onUpdate={props.onUpdateTask}
                          onRemove={props.onRemoveTask}
                />
            ))
            .value()
    }</div>;


export default TaskFeeds;

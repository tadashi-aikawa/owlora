import * as _ from 'lodash';
import * as React from 'react';
import {Component} from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {Button, Welcome} from '@storybook/react/demo';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Task from '../models/Task';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import * as Moment from 'moment';
import DailyCard from '../components/DailyCard';
import {boolean, number, object, select, text, withKnobs} from '@storybook/addon-knobs';

const toDate = (v: string) => Moment(v, 'YYYY/MM/DD');

@DragDropContext(HTML5Backend)
class DnDWrapper extends Component<any, any> {
    render() {
        return <div>{this.props.children}</div>;
    }
}

const DnDWrapperDecorator = (storyFn) => <DnDWrapper>{storyFn()}</DnDWrapper>;
const CoolPaddingDecorator = (storyFn) => <div style={{padding: 20}}>{storyFn()}</div>;
const createTask = (properties): Task => _.assign({}, {
    id: null,
    dayOrder: null,

    icon: ":innocent:",
    color: "rgba(150, 150, 150, 0.1)",
    isMilestone: false,

    name: "Task",
    projectName: "Project",
    dueDate: toDate('2099/01/01'),
    estimatedMinutes: 15,
    dateString: "",
}, properties);


storiesOf('DailyCard', module)
    .addDecorator(DnDWrapperDecorator)
    .addDecorator(withKnobs)
    .addDecorator(CoolPaddingDecorator)
    .add('Summary', () => (
        <DailyCard date={toDate(text('Date', '2099/01/01'))}
                   taskSortField={select('Task sort field', TaskSortField.toObject, TaskSortField.PROJECT_NAME)}
                   taskOrder={select('Task order', Order.toObject, Order.ASC)}
                   minutesToUsePerDay={number('Minutes to use per day', 300)}
                   minutesToUsePerSpecificDays={{}}
                   tasks={object(
                       'Tasks',
                       [
                           createTask({
                               id: 1,
                               dayOrder: 1,
                               icon: "https://s3-us-west-2.amazonaws.com/svgporn.com/logos/react.svg"
                           }),
                           createTask({id: 2, dayOrder: 2, icon: ":japan:"}),
                           createTask({id: 3, dayOrder: 3, icon: ":japan:", color: "rgba(200, 50, 50, 0.1)"}),
                           createTask({id: 4, name: 'Milestone', dayOrder: 4, isMilestone: true}),
                       ]
                   )}
                   onUpdateTask={action}
        />
    ))
    .add('Icon from emoji', () => (
        <DailyCard date={toDate('2099/01/01')}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={300}
                   minutesToUsePerSpecificDays={{}}
                   tasks={[createTask({
                       id: 1,
                       dayOrder: 1,
                       icon: text('task.icon', ':innocent:'),
                   })]}
                   onUpdateTask={action}
        />
    ))
    .add('Icon from url', () => (
        <DailyCard date={toDate('2099/01/01')}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={300}
                   minutesToUsePerSpecificDays={{}}
                   tasks={[createTask({
                       id: 1,
                       dayOrder: 1,
                       icon: text('task.icon', 'https://s3-us-west-2.amazonaws.com/svgporn.com/logos/react.svg'),
                   })]}
                   onUpdateTask={action}
        />
    ))
    .add('Color of card', () => (
        <DailyCard date={toDate('2099/01/01')}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={300}
                   minutesToUsePerSpecificDays={{}}
                   tasks={[createTask({
                       id: 1,
                       dayOrder: 1,
                       color: text("task.color", "rgba(200, 50, 50, 0.2)")
                   })]}
                   onUpdateTask={action}
        />
    ))
    .add('Milestone', () => (
        <DailyCard date={toDate('2099/01/01')}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={300}
                   minutesToUsePerSpecificDays={{}}
                   tasks={[createTask({
                       id: 1,
                       dayOrder: 1,
                       isMilestone: boolean("task.isMilestone", true)
                   })]}
                   onUpdateTask={action}
        />
    ))
    .add('Warning', () => (
        <DailyCard date={toDate('2099/01/01')}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={100}
                   minutesToUsePerSpecificDays={{}}
                   tasks={[createTask({
                       id: 1,
                       dayOrder: 1,
                       estimatedMinutes: number('task.estimatedMinutes', 61)
                   })]}
                   onUpdateTask={action}
        />
    ))
    .add('Danger', () => (
        <DailyCard date={toDate('2099/01/01')}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={100}
                   minutesToUsePerSpecificDays={{}}
                   tasks={[createTask({
                       id: 1,
                       dayOrder: 1,
                       estimatedMinutes: number('task.estimatedMinutes', 81)
                   })]}
                   onUpdateTask={action}
        />
    ))
    .add('Lack', () => (
        <DailyCard date={toDate('2099/01/01')}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={50}
                   minutesToUsePerSpecificDays={{}}
                   tasks={[createTask({
                       id: 1,
                       dayOrder: 1,
                       estimatedMinutes: number('task.estimatedMinutes', 80)
                   })]}
                   onUpdateTask={action}
        />
    ))
    .add('Offtime', () => (
        <DailyCard date={toDate('2099/01/01')}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={300}
                   minutesToUsePerSpecificDays={object('minutesToUsePerSpecificDays', {
                       '20990101': 0
                   })}
                   tasks={[]}
                   onUpdateTask={action}
        />
    ))
    .add('Past', () => (
        <DailyCard date={toDate(text('date', '2000/01/01'))}
                   taskSortField={TaskSortField.PROJECT_NAME}
                   taskOrder={Order.ASC}
                   minutesToUsePerDay={300}
                   minutesToUsePerSpecificDays={{}}
                   tasks={[createTask({
                       id: 1,
                       dayOrder: 1,
                   })]}
                   onUpdateTask={action}
        />
    ));

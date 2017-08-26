import * as _ from 'lodash';
import * as React from 'react';

import {storiesOf} from '@storybook/react';
import {WithNotes} from '@storybook/addon-notes';
import {action} from '@storybook/addon-actions';
import {Card} from 'semantic-ui-react';

import Task from '../models/Task';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import * as Moment from 'moment';
import DailyCard from '../components/DailyCard';
import {boolean, number, object, select, text, withKnobs} from '@storybook/addon-knobs';
import DnDWrapper from './DnDWrapper';
import CardAppearance from '../constants/CardAppearance';
import Size from '../constants/Size';

const DnDWrapperDecorator = (storyFn) => <DnDWrapper>{storyFn()}</DnDWrapper>;


const toDate = (v: string) => Moment(v, 'YYYY/MM/DD');
const toDateTime = (v: string) => Moment(v, 'YYYY/MM/DD H:mm');
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
                           createTask({id: 1, name: 'Task1', dayOrder: 3, icon: ":person_with_pouting_face:"}),
                           createTask({
                               id: 2,
                               name: 'Task2 this is long name task hogehoge!! (11:00-12:00)',
                               dayOrder: 2,
                               icon: ":whale:",
                               time: {
                                   start: toDateTime('2099/01/01 11:00'),
                                   end: toDateTime('2099/01/01 12:00'),
                               },
                           }),
                           createTask({
                               id: 3,
                               name: 'Task3 (13:30-16:15)',
                               dayOrder: 1,
                               icon: ":japan:",
                               color: "rgba(200, 50, 50, 0.1)",
                               time: {
                                   start: toDateTime('2099/01/01 13:30'),
                                   end: toDateTime('2099/01/01 16:15'),
                               },
                           }),
                           createTask({id: 4, name: 'Milestone', dayOrder: 4, color: "purple", isMilestone: true}),
                       ]
                   )}
                   appearance={select('Appearance', CardAppearance.toObject, CardAppearance.DETAIL)}
                   onUpdateTask={action}
        />
    ))
    .add('Appearance', () => (
        <Card.Group>
            <DailyCard date={toDate('2099/01/01')}
                       taskSortField={TaskSortField.PROJECT_NAME}
                       taskOrder={Order.ASC}
                       minutesToUsePerDay={300}
                       minutesToUsePerSpecificDays={{}}
                       tasks={[
                           createTask({id: 1, dayOrder: 1, icon: ':innocent:',}),
                           createTask({id: 2, name: 'Milestone', dayOrder: 2, color: "purple", isMilestone: true}),
                       ]}
                       appearance={select('Appearance (overview)', CardAppearance.toObject, CardAppearance.OVERVIEW)}
                       onUpdateTask={action}
            />
            <DailyCard date={toDate('2099/01/01')}
                       taskSortField={TaskSortField.PROJECT_NAME}
                       taskOrder={Order.ASC}
                       minutesToUsePerDay={300}
                       minutesToUsePerSpecificDays={{}}
                       tasks={[
                           createTask({id: 1, dayOrder: 1, icon: ':innocent:',}),
                           createTask({id: 2, name: 'Milestone', dayOrder: 2, color: "purple", isMilestone: true}),
                       ]}
                       appearance={select('Appearance (detail)', CardAppearance.toObject, CardAppearance.DETAIL)}
                       onUpdateTask={action}
            />
        </Card.Group>
    ))
    .add('Sort', () => {
        const tasks: Task[] = [
            createTask({id: 1, name: 'Task1', projectName: 'PJ2', dayOrder: 3, estimatedMinutes: 10, icon: ":bow:"}),
            createTask({id: 2, name: 'Task2', projectName: 'PJ1', dayOrder: 2, estimatedMinutes: 50, icon: ":whale:"}),
            createTask({id: 3, name: 'Task3', projectName: 'PJ3', dayOrder: 1, estimatedMinutes: 20, icon: ":whale:"}),
            createTask({
                id: 4,
                name: 'Milestone',
                dayOrder: 4,
                estimatedMinutes: 100,
                color: "purple",
                isMilestone: true
            }),
        ];

        return (
            <Card.Group>
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={select('Sort by project', TaskSortField.toObject, TaskSortField.PROJECT_NAME)}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={300}
                           minutesToUsePerSpecificDays={{}}
                           tasks={tasks}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={select('Sort by day order', TaskSortField.toObject, TaskSortField.DAY_ORDER)}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={300}
                           minutesToUsePerSpecificDays={{}}
                           tasks={tasks}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={select('Sort by estimated minutes', TaskSortField.toObject, TaskSortField.ESTIMATED_MINUTES)}
                           taskOrder={Order.DESC}
                           minutesToUsePerDay={300}
                           minutesToUsePerSpecificDays={{}}
                           tasks={tasks}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={select('Sort by task name', TaskSortField.toObject, TaskSortField.TASK_NAME)}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={300}
                           minutesToUsePerSpecificDays={{}}
                           tasks={tasks}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
            </Card.Group>
        )
    })
    .add('Time lamps', () => {
        return (
            <Card.Group>
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.TASK_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={300}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[createTask({
                               name: 'Task1 (11:00-12:00)',
                               time: {
                                   start: toDateTime(text('(1)time.start', '2099/01/01 11:00')),
                                   end: toDateTime(text('(1)time.end', '2099/01/01 12:00')),
                               },
                           })]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.TASK_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={300}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[
                               createTask({
                                   id: 1,
                                   name: 'Task1 (11:00-12:00)',
                                   time: {
                                       start: toDateTime(text('(2)Task1: time.start', '2099/01/01 11:00')),
                                       end: toDateTime(text('(2)Task1: time.end', '2099/01/01 12:00')),
                                   },
                               }),
                               createTask({
                                   id: 2,
                                   name: 'Task2 (14:15-17:15)',
                                   time: {
                                       start: toDateTime(text('(2)Task2: time.start', '2099/01/01 14:15')),
                                       end: toDateTime(text('(2)Task2: time.end', '2099/01/01 17:15')),
                                   },
                               })
                           ]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.TASK_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={300}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[
                               createTask({
                                   id: 1,
                                   name: 'Task1 (16:00-16:15)',
                                   time: {
                                       start: toDateTime(text('(3)Task1: time.start', '2099/01/01 16:00')),
                                       end: toDateTime(text('(3)Task1: time.end', '2099/01/01 16:15')),
                                   },
                               }),
                               createTask({
                                   id: 2,
                                   name: 'Task2 (15:00-17:00)',
                                   time: {
                                       start: toDateTime(text('(3)Task2: time.start', '2099/01/01 15:00')),
                                       end: toDateTime(text('(3)Task2: time.end', '2099/01/01 17:00')),
                                   },
                               })
                           ]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
            </Card.Group>
        )
    })
    .add('Feed icon', () => (
        <Card.Group>
            <DailyCard date={toDate('2099/01/01')}
                       taskSortField={TaskSortField.PROJECT_NAME}
                       taskOrder={Order.ASC}
                       minutesToUsePerDay={300}
                       minutesToUsePerSpecificDays={{}}
                       tasks={[createTask({
                           id: 1,
                           dayOrder: 1,
                           icon: text('task.icon (emoji)', ':innocent:'),
                       })]}
                       appearance={CardAppearance.DETAIL}
                       onUpdateTask={action}
            />
            <DailyCard date={toDate('2099/01/01')}
                       taskSortField={TaskSortField.PROJECT_NAME}
                       taskOrder={Order.ASC}
                       minutesToUsePerDay={300}
                       minutesToUsePerSpecificDays={{}}
                       tasks={[createTask({
                           id: 1,
                           dayOrder: 1,
                           icon: text('task.icon (url)', 'https://s3-us-west-2.amazonaws.com/svgporn.com/logos/react.svg'),
                       })]}
                       appearance={CardAppearance.DETAIL}
                       onUpdateTask={action}
            />
        </Card.Group>
    ))
    .add('Feed color', () => (
        <Card.Group>
            <DailyCard date={toDate('2099/01/01')}
                       taskSortField={TaskSortField.PROJECT_NAME}
                       taskOrder={Order.ASC}
                       minutesToUsePerDay={300}
                       minutesToUsePerSpecificDays={{}}
                       tasks={[createTask({
                           id: 1,
                           dayOrder: 1,
                           color: text("task.color (name)", "pink")
                       })]}
                       appearance={CardAppearance.DETAIL}
                       onUpdateTask={action}
            />
            <DailyCard date={toDate('2099/01/01')}
                       taskSortField={TaskSortField.PROJECT_NAME}
                       taskOrder={Order.ASC}
                       minutesToUsePerDay={300}
                       minutesToUsePerSpecificDays={{}}
                       tasks={[createTask({
                           id: 1,
                           dayOrder: 1,
                           color: text("task.color (rgb)", "#7777CC")
                       })]}
                       appearance={CardAppearance.DETAIL}
                       onUpdateTask={action}
            />
            <DailyCard date={toDate('2099/01/01')}
                       taskSortField={TaskSortField.PROJECT_NAME}
                       taskOrder={Order.ASC}
                       minutesToUsePerDay={300}
                       minutesToUsePerSpecificDays={{}}
                       tasks={[createTask({
                           id: 1,
                           dayOrder: 1,
                           color: text("task.color (rgba)", "rgba(200, 50, 50, 0.2)")
                       })]}
                       appearance={CardAppearance.DETAIL}
                       onUpdateTask={action}
            />
        </Card.Group>
    ))
    .add('Milestone', () => (
        <WithNotes notes='Even if Milestone has a estimated minutes, ignored estimated them'>
            <DailyCard date={toDate('2099/01/01')}
                       taskSortField={TaskSortField.PROJECT_NAME}
                       taskOrder={Order.ASC}
                       minutesToUsePerDay={300}
                       minutesToUsePerSpecificDays={{}}
                       tasks={[createTask({
                           id: 1,
                           name: ":beer: Party!!",
                           dayOrder: 1,
                           color: text("task.color", "purple"),
                           size: select("task.size", Size.toObject, Size.LARGE),
                           isMilestone: boolean("task.isMilestone", true)
                       })]}
                       appearance={CardAppearance.DETAIL}
                       onUpdateTask={action}
            />
        </WithNotes>
    ))
    .add('Life status', () => (
        <WithNotes notes='Lack < ♥ 0 <= Danger < ♥20% <= Warning < ♥40% <= Fine'>
            <Card.Group>
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.PROJECT_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={100}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[createTask({
                               id: 1,
                               dayOrder: 1,
                               estimatedMinutes: number('task.estimatedMinutes (fine♥40)', 60)
                           })]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.PROJECT_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={100}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[createTask({
                               id: 1,
                               dayOrder: 1,
                               estimatedMinutes: number('task.estimatedMinutes (warning♥39)', 61)
                           })]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.PROJECT_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={100}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[createTask({
                               id: 1,
                               dayOrder: 1,
                               estimatedMinutes: number('task.estimatedMinutes (warning♥20)', 80)
                           })]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.PROJECT_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={100}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[createTask({
                               id: 1,
                               dayOrder: 1,
                               estimatedMinutes: number('task.estimatedMinutes (danger♥19)', 81)
                           })]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.PROJECT_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={100}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[createTask({
                               id: 1,
                               dayOrder: 1,
                               estimatedMinutes: number('task.estimatedMinutes (danger♥0)', 100)
                           })]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
                <DailyCard date={toDate('2099/01/01')}
                           taskSortField={TaskSortField.PROJECT_NAME}
                           taskOrder={Order.ASC}
                           minutesToUsePerDay={100}
                           minutesToUsePerSpecificDays={{}}
                           tasks={[createTask({
                               id: 1,
                               dayOrder: 1,
                               estimatedMinutes: number('task.estimatedMinutes (lack)', 101)
                           })]}
                           appearance={CardAppearance.DETAIL}
                           onUpdateTask={action}
                />
            </Card.Group>
        </WithNotes>
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
                   appearance={CardAppearance.DETAIL}
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
                   appearance={CardAppearance.DETAIL}
                   onUpdateTask={action}
        />
    ));

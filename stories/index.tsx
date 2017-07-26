import '../node_modules/semantic-ui-css/semantic.min.css';

import * as _ from 'lodash';
import * as React from 'react';
import {Component} from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {Button, Welcome} from '@storybook/react/demo';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Task from '../src/models/Task';
import TaskSortField from '../src/constants/TaskSortField';
import Order from '../src/constants/Order';
import * as Moment from 'moment';
import DailyCard from '../src/components/DailyCard';
import {boolean, number, object, select, text, withKnobs} from '@storybook/addon-knobs';

const toDate = (v: string) => Moment(v, 'YYYY/MM/DD');

@DragDropContext(HTML5Backend)
class DnDWrapper extends Component<any, any> {
    render() {
        return <div>{this.props.children}</div>;
    }
}

//const CoolPadding = ({children}) => <div style={{padding: 20}}>{children}</div>;
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
    .addDecorator(withKnobs)
    .addDecorator(CoolPaddingDecorator)
    .add('Summary', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Icon from emoji', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Icon from url', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Color of card', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Milestone', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Warning', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Danger', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Lack', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Offtime', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ))
    .add('Past', () => (
        <DnDWrapper>
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
        </DnDWrapper>
    ));

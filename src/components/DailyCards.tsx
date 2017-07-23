import * as React from 'react';
import * as _ from 'lodash';
import {Card, SemanticWIDTHS} from 'semantic-ui-react';
import * as moment from 'moment';
import {Moment} from 'moment';
import {SIMPLE_FORMAT} from '../storage/settings';
import Task, {TaskUpdateParameter} from '../models/Task';
import DailyCard from './DailyCard';
import {Dictionary} from 'lodash';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';


const isWeekDay = (date: Moment): boolean => date.day() > 0 && date.day() < 6;
const isMonDay = (date: Moment): boolean => date.day() === 1;
const isTuesDay = (date: Moment): boolean => date.day() === 2;
const isWednesDay = (date: Moment): boolean => date.day() === 3;
const isThursDay = (date: Moment): boolean => date.day() === 4;
const isFriDay = (date: Moment): boolean => date.day() === 5;

const inTheDay = (task: Task, date: Moment): boolean => {
    if (date.format(SIMPLE_FORMAT) === task.dueDate.format(SIMPLE_FORMAT)) {
        return true;
    }

    return date.isSameOrAfter(task.dueDate) && _.some([
        task.dateString === '毎日',
        task.dateString === '平日' && isWeekDay(date),
        task.dateString === '毎週月曜' && isMonDay(date),
        task.dateString === '毎週火曜' && isTuesDay(date),
        task.dateString === '毎週水曜' && isWednesDay(date),
        task.dateString === '毎週木曜' && isThursDay(date),
        task.dateString === '毎週金曜' && isFriDay(date),
    ]);
};

export interface TaskCardsProps {
    tasks: Task[];
    taskSortField: TaskSortField;
    taskOrder: Order;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: Dictionary<number>;
    numberOfCardsPerRow: SemanticWIDTHS;

    onUpdateTask: (parameter: TaskUpdateParameter) => void;
}

export const DailyCards = (props: TaskCardsProps) => {
    const dates: Moment[] = _(_.range(0, 30))
        .map(i => moment().startOf('week').add(i, 'day'))
        .filter(isWeekDay)
        .value();

    return (
        <Card.Group itemsPerRow={props.numberOfCardsPerRow}>
            {dates.map((date: Moment) => (
                <DailyCard
                    key={date.toString()}
                    date={date}
                    tasks={props.tasks.filter(t => inTheDay(t, date))}
                    taskSortField={props.taskSortField}
                    taskOrder={props.taskOrder}
                    minutesToUsePerDay={props.minutesToUsePerDay}
                    minutesToUsePerSpecificDays={props.minutesToUsePerSpecificDays}
                    onUpdateTask={props.onUpdateTask}
                />
            ))}
        </Card.Group>
    );
};

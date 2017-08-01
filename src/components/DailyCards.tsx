import * as React from 'react';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import {Card, SemanticWIDTHS} from 'semantic-ui-react';
import * as moment from 'moment';
import {Moment} from 'moment';
import {SIMPLE_FORMAT} from '../storage/settings';
import Task, {TaskUpdateParameter} from '../models/Task';
import DailyCard from './DailyCard';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import CardAppearance from '../constants/CardAppearance';
import Repetition from '../constants/Repetition';
import * as DateUtil from '../utils/DateUtil';

const inTheDay = (task: Task, date: Moment): boolean => {
    if (date.format(SIMPLE_FORMAT) === task.dueDate.format(SIMPLE_FORMAT)) {
        return true;
    }

    return date.isSameOrAfter(task.dueDate) && _.some([
        task.repetition === Repetition.EVERY_DAY,
        task.repetition === Repetition.WEEKDAY && DateUtil.isWeekDay(date),
        task.repetition === Repetition.EVERY_MONDAY && DateUtil.isMonDay(date),
        task.repetition === Repetition.EVERY_TUESDAY && DateUtil.isTuesDay(date),
        task.repetition === Repetition.EVERY_WEDNESDAY && DateUtil.isWednesDay(date),
        task.repetition === Repetition.EVERY_THURSDAY && DateUtil.isThursDay(date),
        task.repetition === Repetition.EVERY_FRIDAY && DateUtil.isFriDay(date),
    ]);
};

export interface TaskCardsProps {
    tasks: Task[];
    taskSortField: TaskSortField;
    taskOrder: Order;
    cardAppearance: CardAppearance;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: Dictionary<number>;
    numberOfCardsPerRow: SemanticWIDTHS;

    onUpdateTask: (parameter: TaskUpdateParameter) => void;
}

export const DailyCards = (props: TaskCardsProps) => {
    const dates: Moment[] = _(_.range(0, 30))
        .map(i => moment().startOf('week').add(i, 'day'))
        .filter(DateUtil.isWeekDay)
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
                    appearance={props.cardAppearance}
                    minutesToUsePerDay={props.minutesToUsePerDay}
                    minutesToUsePerSpecificDays={props.minutesToUsePerSpecificDays}
                    onUpdateTask={props.onUpdateTask}
                />
            ))}
        </Card.Group>
    );
};

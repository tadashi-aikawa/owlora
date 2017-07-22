import * as React from 'react';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import {Dimmer, Card, Feed, Icon, Message, Progress, Segment, Statistic} from 'semantic-ui-react';
import {Moment, now} from 'moment';
import {DATE_FORMAT, SIMPLE_FORMAT} from '../storage/settings';
import {TaskFeed} from './TaskFeed';
import Task from '../models/Task';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';


const Fire = ({minutes}) =>
    <span>
        <Icon name="fire"/><Icon name="fire"/><Icon name="fire"/>
        Lack {minutes} <Icon name="heart"/>
        <Icon name="fire"/><Icon name="fire"/><Icon name="fire"/>
    </span>;

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
    }
};

export interface DailyCardProps {
    date: Moment;
    tasks: Task[];
    taskSortField: TaskSortField;
    taskOrder: Order;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: Dictionary<number>;
}

export const DailyCard = (props: DailyCardProps) => {
    const totalElapsedMinutes = _.sumBy(
        props.tasks.filter(t => t.dateString !== '毎日' && t.dateString !== '平日'),
        t => t.estimatedMinutes
    );
    const specifiedMinutes = props.minutesToUsePerSpecificDays[props.date.format(SIMPLE_FORMAT)];
    const minutesToUse = specifiedMinutes !== undefined ? specifiedMinutes : props.minutesToUsePerDay;
    const freeMinutes = minutesToUse - totalElapsedMinutes;

    const toTaskFeed = (task: Task) =>
        <TaskFeed
            key={task.id}
            name={task.name}
            project={task.projectName}
            iconUrl={task.iconUrl}
            estimatedMinutes={task.estimatedMinutes}
        />;

    return (
        <Card>
            <Dimmer active={props.date.isBefore(now(), 'day')} content={
                <div>
                    <h2>Facing forward !!</h2>
                    <Icon name='hand outline right' size='huge'/>
                </div>
            }/>
            <Segment inverted>
                <Statistic size='mini' color="olive">
                    <Statistic.Value>{props.date.format(DATE_FORMAT)}</Statistic.Value>
                </Statistic>
                <Progress value={freeMinutes}
                          total={props.minutesToUsePerDay}
                          color="green"
                          size="small"
                          inverted="true"
                          error={freeMinutes / props.minutesToUsePerDay < 0.20}
                          warning={freeMinutes / props.minutesToUsePerDay < 0.40}
                          disabled={minutesToUse === 0}
                >
                    {
                        freeMinutes < 0
                            ? <Fire minutes={-freeMinutes} />
                            : <span><Icon name="heart"/> {freeMinutes}</span>
                    }
                </Progress>
            </Segment>
            <Card.Content>
                <Message info icon hidden={specifiedMinutes !== 0}>
                    <Icon name='smile'/>
                    <Message.Content>
                        <Message.Header>
                            Off time
                        </Message.Header>
                        <p>Enjoy without tasks</p>
                    </Message.Content>
                </Message>
                <Message negative icon hidden={freeMinutes >= 0}>
                    <Icon name='warning sign'/>
                    <Message.Content>
                        <Message.Header>
                            Move your tasks to other days!!
                        </Message.Header>
                    </Message.Content>
                </Message>
                <Feed>
                    {_(props.tasks)
                        .filter((t: Task) => t.dateString !== '毎日' && t.dateString !== '平日')
                        .orderBy(t => toSortFieldValue(t, props.taskSortField), props.taskOrder)
                        .map(toTaskFeed)
                        .value()
                    }
                </Feed>
            </Card.Content>
        </Card>
    );
};

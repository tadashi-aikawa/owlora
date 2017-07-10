import * as React from 'react';
import * as _ from 'lodash';
import {Icon, Message, Card, Feed, Label, Segment, Statistic, Dimmer} from 'semantic-ui-react';
import {Moment} from 'moment';
import {DATE_FORMAT, MINUTES_PER_DAY, MINUTES_PER_SPECIFIC_DAYS, SIMPLE_FORMAT} from '../storage/settings';
import {TaskFeed} from './TaskFeed';
import Task from '../models/Task';

const colorMap = (time: number) => {
    if (time < -120) return "red";
    if (time < -60) return "violet";
    if (time <= 0) return "orange";
    return "green";
};

export interface DailyCardProps {
    date: Moment;
    tasks: Task[];
}

export const DailyCard = (props: DailyCardProps) => {
    const totalElapsedMinutes = _.sumBy(
        props.tasks.filter(t => t.dateString !== '毎日' && t.dateString !== '平日'),
        t => t.elapsedMinutes
    );
    const specifiedMinutes = MINUTES_PER_SPECIFIC_DAYS[props.date.format(SIMPLE_FORMAT)];
    const freeMinutes = (specifiedMinutes !== undefined ? specifiedMinutes : MINUTES_PER_DAY) - totalElapsedMinutes;

    const toTaskFeed = (task: Task) =>
        <TaskFeed
            key={task.id}
            name={task.name}
            project={task.projectName}
            elapsedMinutes={task.elapsedMinutes}
        />;

    return (
        <Card>
            <Segment inverted>
                <Statistic size='mini' color="olive">
                    <Statistic.Value>{props.date.format(DATE_FORMAT)}</Statistic.Value>
                </Statistic>
                <Label.Group>
                    <Label color={colorMap(freeMinutes)}>
                        Total
                        <Label.Detail>{totalElapsedMinutes}</Label.Detail>
                    </Label>
                    <Label color={colorMap(freeMinutes)}>
                        Reminding
                        <Label.Detail>{freeMinutes}</Label.Detail>
                    </Label>
                </Label.Group>
            </Segment>
            <Card.Content>
                <Message info icon hidden={specifiedMinutes !== 0}>
                    <Icon name='smile' />
                    <Message.Content>
                        <Message.Header>
                            Off time
                        </Message.Header>
                        <p>Enjoy without tasks</p>
                    </Message.Content>
                </Message>
                <Message negative icon hidden={!(specifiedMinutes === 0 && totalElapsedMinutes !== 0)}>
                    <Icon name='warning sign'/>
                    <Message.Content>
                        <Message.Header>
                            Move your tasks to other days!!
                        </Message.Header>
                    </Message.Content>
                </Message>
                <Feed>
                    {props.tasks
                        .filter(t => t.dateString !== '毎日' && t.dateString !== '平日')
                        .map(toTaskFeed)
                    }
                </Feed>
            </Card.Content>
        </Card>
    );
};

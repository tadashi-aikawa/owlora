import * as React from 'react';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import {Dimmer, Card, Feed, Icon, Message, Progress, Segment, Statistic} from 'semantic-ui-react';
import {Moment} from 'moment';
import {DATE_FORMAT, SIMPLE_FORMAT} from '../storage/settings';
import {TaskFeed} from './TaskFeed';
import Task from '../models/Task';

export interface DailyCardProps {
    date: Moment;
    tasks: Task[];
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: Dictionary<number>;
}

export const DailyCard = (props: DailyCardProps) => {
    const totalElapsedMinutes = _.sumBy(
        props.tasks.filter(t => t.dateString !== '毎日' && t.dateString !== '平日'),
        t => t.elapsedMinutes
    );
    const specifiedMinutes = props.minutesToUsePerSpecificDays[props.date.format(SIMPLE_FORMAT)];
    const minutesToUse = specifiedMinutes !== undefined ? specifiedMinutes : props.minutesToUsePerDay;
    const freeMinutes = minutesToUse - totalElapsedMinutes;

    const toTaskFeed = (task: Task) =>
        <TaskFeed
            key={task.id}
            name={task.name}
            project={task.projectName}
            elapsedMinutes={task.elapsedMinutes}
        />;

    return (
        <Card>
            <Dimmer active={props.date.isBefore()} content={
                <div>
                    <h2>Facing forward !!</h2>
                    <Icon name='hand outline right' size='huge' />
                </div>
            } />
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
                            ? <span><Icon name="fire"/> Lack {-freeMinutes}</span>
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
                    {props.tasks
                        .filter(t => t.dateString !== '毎日' && t.dateString !== '平日')
                        .map(toTaskFeed)
                    }
                </Feed>
            </Card.Content>
        </Card>
    );
};

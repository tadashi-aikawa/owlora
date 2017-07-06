import * as React from 'react';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import {Card, Feed, Label, Segment, Statistic} from 'semantic-ui-react';
import Emojify from 'react-emojione';
import * as moment from 'moment';


const MINUTES = 240;
const DATE_FORMAT = "YYYY-MM-DD (ddd)";

export interface Task {
    name: string;
    projectName: string;
    dueDate: string;
    elapsedMinutes: number
}

export interface TaskFeedProps {
    name: string;
    project: string;
    elapsedMinutes: number;
}

export const TaskFeed = (props: TaskFeedProps) =>
    <Feed.Event>
        <Feed.Label image='https://blog.todoist.com/wp-content/uploads/2015/09/todoist-logo.png' />
        <Feed.Content>
            <Feed.Date content={props.project} />
            <Feed.Summary>
                <Emojify style={{height: 20, width: 20}}>{props.name}</Emojify>
            </Feed.Summary>
        </Feed.Content>
        <Label color='teal' circular style={{width:25, height:20, textAlign: 'center'}}>{props.elapsedMinutes}</Label>
    </Feed.Event>;


export interface DailyCardProps {
    date: string
    tasks: Task[];
}

export const DailyCard = (props: DailyCardProps) => {
    const totalElapsedMinutes = _.sumBy(props.tasks, t => t.elapsedMinutes);
    const colorMap = (time: number) => {
        if (time >= 0) return "green";
        if (time < 0) return "orange";
        if (time < 1) return "violet";
        if (time < 2) return "red";
    };
    const freeMinutes = MINUTES - totalElapsedMinutes;

    return <Card>
        <Segment inverted>
            <Statistic size='mini' color="olive">
                <Statistic.Value>{moment(props.date).format(DATE_FORMAT)}</Statistic.Value>
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
            <Feed>
                {_.map(props.tasks, (t, i) =>
                    <TaskFeed key={i}
                              name={t.name}
                              project={t.projectName}
                              elapsedMinutes={t.elapsedMinutes} />
                )}
            </Feed>
        </Card.Content>
    </Card>;
};

export interface TopProps {
    tasks: Task[];
}

export const Top = (props: TopProps) => {
    const tasksByDueDate: Dictionary<Task[]> = _(props.tasks)
        .groupBy(t => moment(t.dueDate).format(DATE_FORMAT))
        .toPairs().sortBy(x => x[0]).fromPairs()
        .value();
    const dates = _(_.range(0, 30))
        .map(i => moment().startOf('week').add(i, 'day'))
        .filter(d => d.day() > 0 && d.day() < 6)
        .value();


    return <div style={{padding: 10}}>
        <Card.Group itemsPerRow={5}>
            {_.map(dates, d => {
                const dateStr = moment(d).format(DATE_FORMAT);
                return <DailyCard key={dateStr}
                                  date={dateStr}
                                  tasks={tasksByDueDate[dateStr]}/>
            })}
        </Card.Group>
    </div>;
};

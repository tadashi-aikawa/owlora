import * as React from "react";
import * as _ from "lodash";
import {
    Card,
    Icon,
    Image,
    Feed,
    Statistic,
    Segment,
    Label
} from 'semantic-ui-react'
import {Dictionary} from 'lodash';
import {fetchTasks} from "../client/TodoistClient";
import Emojify from 'react-emojione';


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
                <Label color='teal' circular>{props.elapsedMinutes}</Label>
            </Feed.Summary>
        </Feed.Content>
    </Feed.Event>;


export interface DailyCardProps {
    date: string
    tasks: Task[];
}

export const DailyCard = (props: DailyCardProps) =>
    <Card style={{width: 400}}>
        <Segment inverted>
            <Statistic size='mini' color="olive" inverted="true">
                <Statistic.Value>{new Date(props.date).toLocaleDateString()}</Statistic.Value>
            </Statistic>
            <Label color='teal' circular>{Math.ceil(_.sumBy(props.tasks, t => t.elapsedMinutes) / 60 * 100) / 100} h</Label>
        </Segment>
        <Card.Content>
            <Feed>
                {_.map(props.tasks, t =>
                    <TaskFeed name={t.name} project={t.projectName} elapsedMinutes={t.elapsedMinutes} />
                )}
            </Feed>
        </Card.Content>
    </Card>;

export interface TopProps {
    tasks: Task[];
}

export const Top = (props: TopProps) => {
    const tasksByDueDate: Dictionary<Task[]> = _(props.tasks)
        .groupBy(t => t.dueDate)
        .toPairs().sortBy(x => Date.parse(x[0])).fromPairs()
        .value();

    return <div style={{padding: 10}}>
        <Card.Group>
            {_.map(tasksByDueDate, (tasks, dueDate) => <DailyCard date={dueDate} tasks={tasks}/>)}
        </Card.Group>
    </div>;
};

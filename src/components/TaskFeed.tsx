import * as React from 'react';
import {Feed, Label} from 'semantic-ui-react';
import Emojify from 'react-emojione';

export interface TaskFeedProps {
    name: string;
    project: string;
    elapsedMinutes: number;
}

export const TaskFeed = (props: TaskFeedProps) =>
    <Feed.Event>
        <Feed.Label image='https://blog.todoist.com/wp-content/uploads/2015/09/todoist-logo.png'/>
        <Feed.Content>
            <Feed.Date content={props.project}/>
            <Feed.Summary>
                <Emojify style={{height: 20, width: 20}}>{props.name}</Emojify>
            </Feed.Summary>
        </Feed.Content>
        <Label color='teal' circular style={{width: 25, height: 20, textAlign: 'center'}}>{props.elapsedMinutes}</Label>
    </Feed.Event>;

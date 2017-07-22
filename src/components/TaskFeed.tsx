import * as React from 'react';
import {Feed, Label} from 'semantic-ui-react';
import Emojify from 'react-emojione';

export interface TaskFeedProps {
    name: string;
    project: string;
    icon: string;
    estimatedMinutes: number;
}

const isEmoji = v => v && v.match(/^:[^:]+:$/);

export const TaskFeed = (props: TaskFeedProps) =>
    <Feed.Event>
        <Feed.Label>
            {isEmoji(props.icon) ? <Emojify>{props.icon}</Emojify> : <img src={props.icon} />}
        </Feed.Label>
        <Feed.Content>
            <Feed.Date content={<Emojify style={{height: 20, width: 20}}>{props.project}</Emojify>}/>
            <Feed.Summary>
                <Emojify style={{height: 20, width: 20, marginLeft: 10}}>{props.name}</Emojify>
            </Feed.Summary>
        </Feed.Content>
        <Label color='teal' circular style={{width: 25, height: 20, textAlign: 'center'}}>{props.estimatedMinutes}</Label>
    </Feed.Event>;

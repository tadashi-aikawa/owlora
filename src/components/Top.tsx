import * as React from 'react';
import {Menu} from 'semantic-ui-react';
import {TaskCards} from './TaskCards';
import {Button, Dimmer, Loader, Segment} from 'semantic-ui-react';
import Task from '../models/Task';


export interface TopProps {
    tasks: Task[];
    isLoading: boolean;
    onReload: () => void;
}

export const Top = (props: TopProps) =>
    <div>
        <Menu stackable inverted>
            <Menu.Item>
                <img src='https://blog.todoist.com/wp-content/uploads/2015/09/todoist-logo.png'/>
            </Menu.Item>
            <Menu.Item>
                <h2>Owlora</h2>
            </Menu.Item>
            <Menu.Item>
                <Button primary onClick={e => {
                    e.preventDefault();
                    props.onReload();
                }}>Reload</Button>
            </Menu.Item>
        </Menu>
        <div style={{padding: 10}}>
            <Dimmer active={props.isLoading} page>
                <Loader content='Loading' size='huge' active={props.isLoading}/>
            </Dimmer>
            <TaskCards tasks={props.tasks}/>
        </div>
    </div>;

import * as React from 'react';
import {Accordion, Button, Dimmer, Form, Input, Loader, Menu} from 'semantic-ui-react';
import {TaskCards} from './TaskCards';
import Task from '../models/Task';
import {Dictionary} from 'lodash';
import {safeLoad, safeDump} from 'js-yaml';

export interface TopProps {
    tasks: Task[];
    apiToken: string;
    estimateLabels: Dictionary<number>;
    isLoading: boolean;
    onReload: () => void;
    onChangeTodoistToken: (token: string) => void;
    onChangeEstimatedLabels: (estimatedLabels: Dictionary<number>) => void;
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
            <Accordion>
                <Accordion.Title>Settings</Accordion.Title>
                <Accordion.Content>
                    <Form>
                        <Form.Field inline>
                            <label>Todoist API token</label>
                            <Input type='password' name="apiToken" value={props.apiToken} onChange={
                                (e, data) => props.onChangeTodoistToken(data.value)
                            }/>
                        </Form.Field>
                        <Form.Field inline>
                            <Form.TextArea label='estimatedLabels'
                                           placeholder='Estimated labels as yaml (key is label id)'
                                           value={safeDump(props.estimateLabels)}
                                           onChange={
                                               (e, data) => props.onChangeEstimatedLabels(safeLoad(data.value))
                                           }/>
                        </Form.Field>
                    </Form>
                </Accordion.Content>
            </Accordion>
        </div>
        <div style={{padding: 10}}>
            <Dimmer active={props.isLoading} page>
                <Loader content='Loading' size='huge' active={props.isLoading}/>
            </Dimmer>
            <TaskCards tasks={props.tasks}/>
        </div>
    </div>;

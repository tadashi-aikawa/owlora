import * as React from 'react';
import {Icon, Button, Dimmer, Loader, Menu, Modal, Header} from 'semantic-ui-react';
import {TaskCards} from './TaskCards';
import Task from '../models/Task';
import CommonConfig from '../models/CommonConfig';
import ConfigEditor from './ConfigEditor';

export interface TopProps {
    tasks: Task[];
    config: CommonConfig;
    isLoading: boolean;

    onReload: () => void;
    onChangeConfig: (config: CommonConfig) => void;
}

export default (props: TopProps) =>
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
            <Menu.Item position='right'>
                <Modal trigger={<Button icon inverted><Icon name="setting" size="large"/></Button>}>
                    <Header icon="setting" content="Settings" />
                    <Modal.Content>
                        <ConfigEditor defaultConfig={props.config}
                                      onSaveConfig={props.onChangeConfig}
                        />
                    </Modal.Content>
                </Modal>
            </Menu.Item>
        </Menu>
        <div style={{padding: 10}}>
            <Dimmer active={props.isLoading} page>
                <Loader content='Loading' size='huge' active={props.isLoading}/>
            </Dimmer>
            <TaskCards tasks={props.tasks}
                       minutesToUsePerDay={props.config.minutesToUsePerDay}
                       minutesToUsePerSpecificDays={props.config.minutesToUsePerSpecificDays}
            />
        </div>
    </div>;

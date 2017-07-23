import * as React from 'react';
import {Message, Icon, Button, Dimmer, Loader, Menu, Modal, Header} from 'semantic-ui-react';
import {TaskCards} from './TaskCards';
import Task, {TaskUpdateParameter} from '../models/Task';
import CommonConfig from '../models/CommonConfig';
import ConfigEditor from './ConfigEditor';
import {Component} from 'react';
import Project from '../models/Project';
import Label from '../models/Label';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import '../../package';
import {version} from '../../package.json';

const toErrorMessage = (error: Error) =>
    <Message negative>
        <Message.Header>{error.name}</Message.Header>
        <p>{error.message}</p>
        <p>{error.stack}</p>
    </Message>;

export interface TopProps {
    tasks: Task[];
    projects: Project[];
    labels: Label[];
    config: CommonConfig;
    isLoading: boolean;
    error: Error;

    onReload: () => void;
    onChangeConfig: (config: CommonConfig) => void;

    // TODO: move to container
    onUpdateTask: (parameter: TaskUpdateParameter) => void;
}

export interface TopState {
    isModalOpen: boolean;
}


@DragDropContext(HTML5Backend)
export default class extends Component<TopProps, TopState> {

    state: TopState = {isModalOpen: false};
    handleOpen = () => this.setState({isModalOpen: true});
    handleClose = () => this.setState({isModalOpen: false});

    render() {
        return (
            <div>
                <Menu stackable inverted>
                    <Menu.Item>
                        <img src='https://blog.todoist.com/wp-content/uploads/2015/09/todoist-logo.png'/>
                    </Menu.Item>
                    <Menu.Item>
                        <h2>Owlora</h2>
                    </Menu.Item>
                    <Menu.Item size="mini">
                        version {version}
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Button icon="refresh" content="Refresh" inverted onClick={e => {
                                e.preventDefault();
                                this.props.onReload();
                            }} />
                        </Menu.Item>
                        <Menu.Item>
                            <Modal open={this.state.isModalOpen} onClose={this.handleClose} trigger={
                                <Button icon inverted onClick={this.handleOpen}>
                                    <Icon name="setting" size="large"/>
                                </Button>
                            }>
                                <Header icon="setting" content="Settings"/>
                                <Modal.Content>
                                    <ConfigEditor defaultConfig={this.props.config}
                                                  projects={this.props.projects}
                                                  labels={this.props.labels}
                                                  onSaveConfig={(config) => {
                                                      this.props.onChangeConfig(config);
                                                      this.handleClose();
                                                      this.props.onReload();
                                                  }}
                                    />
                                </Modal.Content>
                            </Modal>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <div style={{padding: 10}}>
                    <Dimmer active={this.props.isLoading} page>
                        <Loader content='Loading' size='huge' active={this.props.isLoading}/>
                    </Dimmer>
                    {
                        this.props.error ? toErrorMessage(this.props.error) :
                            this.props.tasks.length
                                ? <TaskCards tasks={this.props.tasks}
                                             taskSortField={this.props.config.taskSortField}
                                             taskOrder={this.props.config.taskOrder}
                                             minutesToUsePerDay={this.props.config.minutesToUsePerDay}
                                             minutesToUsePerSpecificDays={this.props.config.minutesToUsePerSpecificDays.dict}
                                             onUpdateTask={this.props.onUpdateTask}/>
                                : ''
                    }
                </div>
            </div>
        );
    }
}

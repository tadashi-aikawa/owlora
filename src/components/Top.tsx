import * as React from 'react';
import {Icon, Button, Dimmer, Loader, Menu, Modal, Header} from 'semantic-ui-react';
import {TaskCards} from './TaskCards';
import Task from '../models/Task';
import CommonConfig from '../models/CommonConfig';
import ConfigEditor from './ConfigEditor';
import {Component} from 'react';
import Project from '../models/Project';
import Label from '../models/Label';

export interface TopProps {
    tasks: Task[];
    projects: Project[];
    labels: Label[];
    config: CommonConfig;
    isLoading: boolean;

    onReload: () => void;
    onChangeConfig: (config: CommonConfig) => void;
}

export interface TopState {
    isModalOpen: boolean;
}

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
                    <Menu.Item>
                        <Button primary onClick={e => {
                            e.preventDefault();
                            this.props.onReload();
                        }}>Reload</Button>
                    </Menu.Item>
                    <Menu.Item position='right'>
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
                </Menu>
                <div style={{padding: 10}}>
                    <Dimmer active={this.props.isLoading} page>
                        <Loader content='Loading' size='huge' active={this.props.isLoading}/>
                    </Dimmer>
                    {
                        this.props.tasks.length
                            ? <TaskCards tasks={this.props.tasks}
                                         taskSortField={this.props.config.taskSortField}
                                         taskOrder={this.props.config.taskOrder}
                                         minutesToUsePerDay={this.props.config.minutesToUsePerDay}
                                         minutesToUsePerSpecificDays={this.props.config.minutesToUsePerSpecificDays.dict}/>
                            : ''
                    }
                </div>
            </div>
        );
    }
}

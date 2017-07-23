import '../../package';

import * as React from 'react';
import {Component} from 'react';
import {Button, Dimmer, Header, Icon, Loader, Menu, Modal} from 'semantic-ui-react';
import {DailyCards} from './DailyCards';
import Task, {TaskUpdateParameter} from '../models/Task';
import CommonConfig from '../models/CommonConfig';
import ConfigEditor from './ConfigEditor';
import Project from '../models/Project';
import Label from '../models/Label';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReduxToastr, {toastr} from 'react-redux-toastr'

import {version} from '../../package.json';


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
    hasErrorToast: boolean;
}


@DragDropContext(HTML5Backend)
export default class extends Component<TopProps, TopState> {

    state: TopState = {isModalOpen: false, hasErrorToast: false};
    handleOpen = () => this.setState({isModalOpen: true});
    handleClose = () => this.setState({isModalOpen: false});

    componentWillReceiveProps(nextProps: TopProps) {
        if (nextProps.error) {
            toastr.error(nextProps.error.name, nextProps.error.message, {
                showCloseButton: false,
                removeOnHover: false
            });
            this.state.hasErrorToast = true;
        } else {
            if (this.state.hasErrorToast) {
                toastr.removeByType("error");
                this.state.hasErrorToast = false;
            }
        }
    }

    render() {
        return (
            <div>
                <Menu stackable inverted fixed="top">
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
                            <Button accessKey="r" icon="refresh" content="Refresh" inverted onClick={e => {
                                e.preventDefault();
                                this.props.onReload();
                            }}/>
                        </Menu.Item>
                        <Menu.Item>
                            <Modal open={this.state.isModalOpen} onClose={this.handleClose} trigger={
                                <Button accessKey="s" icon inverted onClick={this.handleOpen}>
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
                <div style={{padding: 10, marginTop: 70}}>
                    <Dimmer active={this.props.isLoading} page>
                        <Loader content='Loading' size='huge' active={this.props.isLoading}/>
                    </Dimmer>
                    <DailyCards tasks={this.props.tasks}
                                taskSortField={this.props.config.taskSortField}
                                taskOrder={this.props.config.taskOrder}
                                minutesToUsePerDay={this.props.config.minutesToUsePerDay}
                                minutesToUsePerSpecificDays={this.props.config.minutesToUsePerSpecificDays.dict}
                                onUpdateTask={this.props.onUpdateTask}/>
                </div>
                <ReduxToastr
                    timeOut={0}
                    newestOnTop={false}
                    preventDuplicates
                    position="bottom-right"
                    transitionIn="fadeIn"
                    transitionOut="fadeOut"
                />
            </div>
        );
    }
}

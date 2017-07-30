import '../../package';

import * as _ from 'lodash';
import * as React from 'react';
import {Component} from 'react';
import {
    Button,
    Checkbox,
    Dimmer,
    Dropdown,
    Header,
    Icon,
    Input,
    Loader,
    Menu,
    Modal,
    SemanticWIDTHS
} from 'semantic-ui-react';
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
import Icebox from './Icebox';
import CardAppearance from '../constants/CardAppearance';
import UiConfig from '../models/UiConfig';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';


export interface TopProps {
    tasks: Task[];
    projects: Project[];
    labels: Label[];
    config: CommonConfig;
    uiConfig: UiConfig;
    isLoading: boolean;
    error: Error;

    onReload: () => void;
    onUpdateTask: (parameter: TaskUpdateParameter) => void;
    onChangeConfig: (config: CommonConfig) => void;
    onChangeUiConfig: (config: UiConfig) => void;
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
                        <img src='https://github.com/tadashi-aikawa/owlora/raw/master/owlora.png'/>
                    </Menu.Item>
                    <Menu.Item>
                        <h2>Owlora</h2>
                    </Menu.Item>
                    <Menu.Item size="mini">
                        version {version}
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <span style={{fontColor: "white", marginRight: 5}}>Icebox</span>
                            <Checkbox checked={this.props.uiConfig.isIceboxVisible}
                                      onChange={() => this.props.onChangeUiConfig(
                                          Object.assign({}, this.props.uiConfig, {isIceboxVisible: !this.props.uiConfig.isIceboxVisible})
                                      )}
                                      toggle/>
                        </Menu.Item>
                        <Menu.Item>
                            <Button.Group>
                                <Button toggle
                                        active={this.props.uiConfig.cardAppearance === CardAppearance.OVERVIEW}
                                        onClick={() => this.props.onChangeUiConfig(
                                            Object.assign({}, this.props.uiConfig, {cardAppearance: CardAppearance.OVERVIEW})
                                        )}>
                                    Overview
                                </Button>
                                <Button.Or/>
                                <Button toggle
                                        active={this.props.uiConfig.cardAppearance === CardAppearance.DETAIL}
                                        onClick={() => this.props.onChangeUiConfig(
                                            Object.assign({}, this.props.uiConfig, {cardAppearance: CardAppearance.DETAIL})
                                        )}>
                                    >
                                    Detail
                                </Button>
                            </Button.Group>
                        </Menu.Item>
                        <Menu.Item>
                            <Button icon={Order.iconNames[this.props.uiConfig.taskOrder]}
                                    onClick={() => this.props.onChangeUiConfig(
                                        Object.assign({}, this.props.uiConfig, {taskOrder: Order.inverses[this.props.uiConfig.taskOrder]})
                                    )}
                                    labelPosition='left'
                                    content={
                                        <Dropdown search
                                                  text={this.props.uiConfig.taskSortField}
                                                  onChange={(e, {value}: { value: TaskSortField }) => this.props.onChangeUiConfig(
                                                      Object.assign({}, this.props.uiConfig, {taskSortField: value})
                                                  )}
                                                  options={
                                                      _.map(TaskSortField.toObject, v => ({key: v, text: v, value: v}))
                                                  }/>
                                    }/>
                        </Menu.Item>
                        <Menu.Item>
                            <Input type='number' min={1} max={5}
                                   label={{basic: true, content: 'col'}}
                                   labelPosition='right'
                                   value={this.props.uiConfig.numberOfCardsPerRow}
                                   onChange={(e, data) => this.props.onChangeUiConfig(
                                       Object.assign({}, this.props.uiConfig, {numberOfCardsPerRow: data.value as SemanticWIDTHS})
                                   )}/>
                        </Menu.Item>
                        <Menu.Item>
                            <Button accessKey="r" icon="refresh" inverted onClick={e => {
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
                    {
                        <div style={
                            this.props.uiConfig.isIceboxVisible ?
                                {
                                    overflowY: "scroll",
                                    position: "fixed",
                                    height: "85vh",
                                    transition: "all 0.5s",
                                }
                                :
                                {
                                    transform: "translate(-400px)",
                                    transition: "all 0.5s",
                                    position: "fixed",
                                }
                        }>
                            <Icebox tasks={this.props.tasks.filter(x => !x.dueDate)}
                                    taskSortField={this.props.uiConfig.taskSortField}
                                    taskOrder={this.props.uiConfig.taskOrder}
                                    onUpdateTask={this.props.onUpdateTask}
                                    width={350}/>
                        </div>
                    }
                    <div style={
                        this.props.uiConfig.isIceboxVisible ?
                            {
                                transform: "scale(0.9, 0.9)",
                                transformOrigin: "top",
                                transition: "all 0.5s",
                                marginLeft: 350,
                            }
                            :
                            {
                                transformOrigin: "top",
                                transition: "all 0.5s"
                            }
                    }>
                        <DailyCards tasks={this.props.tasks.filter(x => x.dueDate)}
                                    taskSortField={this.props.uiConfig.taskSortField}
                                    taskOrder={this.props.uiConfig.taskOrder}
                                    cardAppearance={this.props.uiConfig.cardAppearance}
                                    minutesToUsePerDay={this.props.config.minutesToUsePerDay}
                                    minutesToUsePerSpecificDays={this.props.config.minutesToUsePerSpecificDays.dict}
                                    numberOfCardsPerRow={this.props.uiConfig.numberOfCardsPerRow}
                                    onUpdateTask={this.props.onUpdateTask}
                        />
                    </div>
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

import '../../package';
import * as React from 'react';
import {Component} from 'react';
import {Dimmer, Feed, Label as SLabel, Loader} from 'semantic-ui-react';
import {DailyCards} from './DailyCards';
import Task, {TaskUpdateParameter} from '../models/Task';
import CommonConfig from '../models/CommonConfig';
import Project from '../models/Project';
import Label from '../models/Label';
import {DragDropContext} from 'react-dnd';
import ReduxToastr, {toastr} from 'react-redux-toastr'
import Emojify from 'react-emojione';

import {version} from '../../package.json';
import Icebox from './Icebox';
import UiConfig from '../models/UiConfig';
import NavigationMenu from './NavigationMenu';

import MultiBackend, {Preview} from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';
import ImageOrEmoji from './ImageOrEmoji';


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
    hasErrorToast: boolean;
}


@DragDropContext(MultiBackend(HTML5toTouch))
export default class extends Component<TopProps, TopState> {

    state: TopState = {hasErrorToast: false};

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

    generatePreview(type, {task}: { task: Task }, style) {
        const {name, projectName, icon, estimatedMinutes, color} = task;
        Object.assign(style, {
            backgroundColor: color,
            border: '2px solid',
            borderRadius: '20px',
            borderColor: color,
            padding: '10px',
        });

        return <Feed style={style}>
            <Feed.Event>
                <Feed.Label>
                    <ImageOrEmoji src={icon}/>
                </Feed.Label>
                <Feed.Content>
                    <Feed.Date content={<Emojify style={{height: 20, width: 20}}>{projectName}</Emojify>}/>
                    <Feed.Summary>
                        <Emojify style={{height: 20, width: 20, marginLeft: 10}}>{name}</Emojify>
                    </Feed.Summary>
                </Feed.Content>
                <SLabel color='teal' circular size="large"
                        style={{
                            margin: 'auto',
                            width: 'auto',
                            textAlign: 'center',
                            marginLeft: 5
                        }}>{estimatedMinutes}</SLabel>
            </Feed.Event>
        </Feed>;
    }

    render() {
        return (
            <div>
                <NavigationMenu projects={this.props.projects}
                                labels={this.props.labels}
                                config={this.props.config}
                                uiConfig={this.props.uiConfig}
                                onReload={this.props.onReload}
                                onChangeConfig={this.props.onChangeConfig}
                                onChangeUiConfig={this.props.onChangeUiConfig}/>
                <div style={{padding: 10, marginTop: 70}}>
                    <Dimmer active={this.props.isLoading} page>
                        <Loader content='Loading' size='huge' active={this.props.isLoading}/>
                    </Dimmer>
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
                                    isTasksExpanded={this.props.uiConfig.isTasksExpanded}
                                    minutesToUsePerDay={this.props.config.minutesToUsePerDay}
                                    minutesToUsePerSpecificDays={this.props.config.minutesToUsePerSpecificDays.dict}
                                    numberOfCards={this.props.uiConfig.numberOfCards}
                                    numberOfCardsPerRow={this.props.uiConfig.numberOfCardsPerRow}
                                    onlyWeekday={this.props.uiConfig.onlyWeekday}
                                    onUpdateTask={this.props.onUpdateTask}
                        />
                    </div>
                </div>
                <Preview generator={this.generatePreview}/>
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

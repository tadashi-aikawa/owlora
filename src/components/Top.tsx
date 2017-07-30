import '../../package';
import * as React from 'react';
import {Component} from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';
import {DailyCards} from './DailyCards';
import Task, {TaskUpdateParameter} from '../models/Task';
import CommonConfig from '../models/CommonConfig';
import Project from '../models/Project';
import Label from '../models/Label';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReduxToastr, {toastr} from 'react-redux-toastr'

import {version} from '../../package.json';
import Icebox from './Icebox';
import UiConfig from '../models/UiConfig';
import NavigationMenu from './NavigationMenu';


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


@DragDropContext(HTML5Backend)
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

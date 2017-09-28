import '../../package';
import * as React from 'react';
import {Component} from 'react';
import * as _ from 'lodash';
import {
    Button,
    Container,
    Dimmer,
    Feed,
    Form,
    Icon,
    Image,
    Label as SLabel,
    Loader,
    Message,
    Step,
    Input,
    Segment,
} from 'semantic-ui-react';
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

import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition, Preview } from 'react-dnd-multi-backend';

import ImageOrEmoji from './ImageOrEmoji';
import {INITIAL_SHARED_STATE} from '../reducers/index';
import {isEmpty, isLoaded} from 'react-redux-firebase'
import IconFilter from './IconFilter';
import Filter from '../models/Filter';
import {Dictionary} from 'lodash';
import Size from '../constants/Size';
import {DEFAULT_TASK_COLOR} from '../storage/settings';


const Steps = ({activeGroupIndex}: { activeGroupIndex: number }) =>
    <Step.Group>
        <Step disabled={activeGroupIndex !== 0}>
            <Image size="tiny"
                   src='https://d1x0mwiac2rqwt.cloudfront.net/bab0a0c4b1c3135a24bd0518417b66e3/as/logo_todoist_schema.png'/>
            <Step.Content title='STEP 1:  Set token'
                          description='Set your todoist token to sync tasks and any more'/>
        </Step>
        <Step disabled={activeGroupIndex !== 1}>
            <Image size="tiny"
                   src="https://www.google.co.jp/images/branding/googleg/1x/googleg_standard_color_128dp.png"/>
            <Step.Content title='STEP 2:  Login'
                          description='Login with your google account to sync settings in your devices'/>
        </Step>
    </Step.Group>;


export interface TopProps {
    tasks: Task[];
    projects: Project[];
    labels: Label[];
    isLoading: boolean;
    guardLoading: boolean;
    error: Error;

    config: CommonConfig;
    uiConfig: UiConfig;
    filter: Filter;
    token: string;
    isTokenUpdating: boolean;
    tokenUpdateError: Error;

    auth: any,
    authError: any,
    profile: any,

    onReload: () => void;
    onBackgroundReload: () => void;
    onUpdateTask: (parameter: TaskUpdateParameter) => void;

    onChangeConfig: (config: CommonConfig) => void;
    onChangeUiConfig: (config: UiConfig) => void;
    onChangeFilter: (filter: Filter) => void;

    onUpdateToken: (token: string) => void;
    onLogin: (provider: string) => void;
    onLogout: () => void;
}

export interface TopState {
    hasErrorToast: boolean;
    inputToken: string;
}

const HTML5toTouch = {
    backends: [
        {
            backend: HTML5Backend
        },
        {
            backend: TouchBackend({enableMouseEvents: true, delayTouchStart: 200}),
            preview: true,
            transition: TouchTransition
        }
    ]
};

@DragDropContext(MultiBackend(HTML5toTouch))
export default class extends Component<TopProps, TopState> {

    constructor(props: TopProps) {
        super();
        this.state = {
            hasErrorToast: false,
            inputToken: props.token,
        };
        this.onChangeFilterWord = _.debounce(this.onChangeFilterWord, 500);
    }

    componentWillReceiveProps(nextProps: TopProps) {
        if (!_.isEqual(this.props.config, nextProps.config)) {
            nextProps.onReload();
        }

        // XXX: mumumumumu....
        if (isLoaded(nextProps.config) && isEmpty(nextProps.config)) {
            nextProps.onChangeConfig(INITIAL_SHARED_STATE.config);
        }

        // Toaster
        if (nextProps.error) {
            toastr.error(nextProps.error.name, nextProps.error.message, {
                showCloseButton: false,
                removeOnHover: false
            });
            this.setState({hasErrorToast: true});
        } else {
            if (this.state.hasErrorToast) {
                toastr.removeByType("error");
                this.setState({hasErrorToast: false});
            }
        }
    }

    componentDidMount() {
        window.addEventListener('focus', this.props.onBackgroundReload, true);
    }

    componentWillUnmount() {
        window.removeEventListener('focus');
    }

    onChangeFilterWord(word) {
        this.props.onChangeFilter({...this.props.filter, ...{word}});
    }

    generatePreview(type, {date, id, name, size, color, icon, projectName, estimatedMinutes}, style) {
        switch(type) {
            case 'task':
                Object.assign(style, {
                    backgroundColor: color || DEFAULT_TASK_COLOR,
                    border: '2px solid',
                    borderRadius: '20px',
                    borderColor: color || DEFAULT_TASK_COLOR,
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
            case 'seal':
                return <SLabel color={color} basic style={style}>
                    <Emojify style={{width: 16, height: 16,}}>
                        {name}
                    </Emojify>
                </SLabel>;
            case 'milestone':
                return <Message color={color} size={size} style={style}>
                    <Message.Content>
                        <Message.Header>
                            <Emojify style={{
                                width: Size.toEmojiSize[size],
                                height: Size.toEmojiSize[size]
                            }}>
                                {name}
                            </Emojify>
                        </Message.Header>
                    </Message.Content>
                </Message>;
            default:
                return
        }
    }

    render() {
        const needsValidTodoistToken = !this.props.token || this.props.tokenUpdateError;
        const needsLogin = isLoaded(this.props.auth) && isEmpty(this.props.auth);
        const readyToLoadingTasks = isLoaded(this.props.config) && !isEmpty(this.props.config);

        if (needsValidTodoistToken) {
            return (
                <Container textAlign="center" style={{marginTop: 60}}>
                    <Steps activeGroupIndex={0}/>
                    <Form onSubmit={() => this.props.onUpdateToken(this.state.inputToken)}>
                        <Form.Field inline required>
                            <label><Icon name="pencil"/>Todoist API token</label>
                            <Form.Input type="password"
                                        name="todoistToken"
                                        value={this.state.inputToken}
                                        onChange={(e, {name, value}) => this.setState({inputToken: value})}
                            />
                        </Form.Field>
                        <Button loading={this.props.isTokenUpdating}>Submit</Button>
                        <Message error visible={!!this.props.tokenUpdateError}>Token is invalid!!</Message>
                    </Form>
                </Container>
            );
        }

        if (needsLogin) {
            return (
                <Container textAlign="center" style={{marginTop: 60}}>
                    <Steps activeGroupIndex={1}/>
                    <div style={{padding: 50}}>
                        <Button color='google plus' onClick={() => this.props.onLogin('google')}>Login with
                            Google</Button>
                    </div>
                </Container>
            );
        }

        if (!readyToLoadingTasks) {
            return (
                <div>
                    <Dimmer active page>
                        <Loader content='Loading settings of your account...' size='huge'
                                active={this.props.isLoading}/>
                    </Dimmer>
                </div>
            );
        }

        return (
            <div>
                <NavigationMenu projects={this.props.projects}
                                labels={this.props.labels}
                                config={this.props.config}
                                uiConfig={this.props.uiConfig}
                                isLoading={this.props.isLoading}
                                onReload={this.props.onReload}
                                onLogout={this.props.onLogout}
                                onChangeConfig={this.props.onChangeConfig}
                                onChangeUiConfig={this.props.onChangeUiConfig}
                />
                <div style={{padding: 10, marginTop: 70}}>
                    <Dimmer active={this.props.isLoading && this.props.guardLoading} page>
                        <Loader content='Loading' size='huge' active={this.props.isLoading && this.props.guardLoading}/>
                    </Dimmer>
                    <div style={
                        this.props.uiConfig.filter ?
                            {
                                opacity: 1,
                                maxHeight: "100%",
                                transformOrigin: "top",
                                transition: "all 0.5s",
                            } :
                            {
                                opacity: 0,
                                maxHeight: 0,
                                transformOrigin: "top",
                                transition: "all 0.5s",
                            }
                    }>
                        <div style={{display: "flex", justifyContent: "flex-end", paddingTop: 10, paddingBottom: 20}}>
                            <Input placeholder='Filter task name by regexp'
                                   icon='filter'
                                   iconPosition='left'
                                   style={{width: 300, marginRight: 20}}
                                   onChange={(e, data) => this.onChangeFilterWord(data.value)}/>
                            <IconFilter icons={_(this.props.tasks).map(t => t.icon).uniq().value()}
                                        iconDisabledMap={this.props.filter.iconDisabledMap}
                                        onChangeIconDisabledMap={(iconDisabledMap) => this.props.onChangeFilter(
                                            {...this.props.filter, ...{iconDisabledMap}}
                                        )}/>
                        </div>
                    </div>
                    <div style={
                        this.props.uiConfig.icebox ?
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
                                milestone={this.props.uiConfig.milestone}
                                seal={this.props.uiConfig.seal}
                                filter={this.props.uiConfig.filter ? this.props.filter : undefined}
                                onUpdateTask={this.props.onUpdateTask}
                                width={350}/>
                    </div>
                    <div style={
                        this.props.uiConfig.icebox ?
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
                                    timeLamps={this.props.uiConfig.timeLamps}
                                    milestone={this.props.uiConfig.milestone}
                                    seal={this.props.uiConfig.seal}
                                    warning={this.props.uiConfig.warning}
                                    isTasksExpanded={this.props.uiConfig.isTasksExpanded}
                                    minutesToUsePerDay={this.props.config.minutesToUsePerDay}
                                    minutesToUsePerSpecificDays={this.props.config.minutesToUsePerSpecificDays.dict || {}}
                                    numberOfCards={this.props.uiConfig.numberOfCards}
                                    numberOfCardsPerRow={this.props.uiConfig.numberOfCardsPerRow}
                                    onlyWeekday={this.props.uiConfig.onlyWeekday}
                                    filter={this.props.uiConfig.filter ? this.props.filter : undefined}
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

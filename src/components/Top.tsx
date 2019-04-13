import "../../package"
import * as React from "react"
import {Component} from "react"
import * as _ from "lodash"
import * as moment from "moment"
import {Button, Container, Dimmer, Form, Icon, Image, Input, Loader, Message, Step,} from "semantic-ui-react"
import {DailyCards} from "./DailyCards"
import Task, {TaskUpdateParameter} from "../models/Task"
import CommonConfig from "../models/CommonConfig"
import Project from "../models/Project"
import Label from "../models/Label"
import {DragDropContext} from "react-dnd"
import ReduxToastr, {toastr} from "react-redux-toastr"
import Icebox from "./Icebox"
import UiConfig from "../models/UiConfig"
import NavigationMenu from "./NavigationMenu"
import {INITIAL_SHARED_STATE} from "../reducers/index"
import IconFilter from "./IconFilter"
import Filter from "../models/Filter"
import HTML5Backend from 'react-dnd-html5-backend'


const Steps = ({ activeGroupIndex }: { activeGroupIndex: number }) => (
    <Step.Group>
        <Step disabled={activeGroupIndex !== 0}>
            <Image
                size="tiny"
                src="https://d1x0mwiac2rqwt.cloudfront.net/bab0a0c4b1c3135a24bd0518417b66e3/as/logo_todoist_schema.png"
            />
            <Step.Content title="STEP 1:  Set token" description="Set your todoist token to sync tasks and any more" />
        </Step>
        <Step disabled={activeGroupIndex !== 1}>
            <Image
                size="tiny"
                src="https://www.google.co.jp/images/branding/googleg/1x/googleg_standard_color_128dp.png"
            />
            <Step.Content
                title="STEP 2:  Login"
                description="Login with your google account to sync settings in your devices"
            />
        </Step>
    </Step.Group>
)

export interface TopProps {
    tasks: Task[]
    projects: Project[]
    labels: Label[]
    isLoading: boolean
    guardLoading: boolean
    error: Error

    config: CommonConfig
    uiConfig: UiConfig
    filter: Filter
    token: string
    isTokenUpdating: boolean
    tokenUpdateError: Error

    auth: any
    authError: any
    profile: any

    onReload: () => void
    onBackgroundReload: () => void
    onUpdateTask: (parameter: TaskUpdateParameter) => void
    onRemoveTask: (id: number) => void

    onChangeConfig: (config: CommonConfig) => void
    onChangeUiConfig: (config: UiConfig) => void
    onChangeFilter: (filter: Filter) => void

    onUpdateToken: (token: string) => void
    onLogin: (provider: string) => void
    onLogout: () => void
}

export interface TopState {
    hasErrorToast: boolean
    inputToken: string
}

const readyToLoadingTasks = (config: CommonConfig): boolean => {
    return !_.isEmpty(config)
}

@DragDropContext(HTML5Backend)
export default class extends Component<TopProps, TopState> {
    constructor(props: TopProps) {
        super(props)
        this.state = {
            hasErrorToast: false,
            inputToken: props.token,
        }
        this.onChangeFilterWord = _.debounce(this.onChangeFilterWord, 500)
        this.onBackgroundReload = this.onBackgroundReload.bind(this)
    }

    componentWillReceiveProps(nextProps: TopProps) {
        // props変わったぜ！ AND firebaseとしてロード完了&何かとれたよー
        if (!_.isEqual(this.props.config, nextProps.config) && readyToLoadingTasks(nextProps.config)) {
            nextProps.onReload()
        }

        // XXX: mumumumumu....
        if (nextProps.auth.isLoaded && !nextProps.config) {
            nextProps.onChangeConfig(INITIAL_SHARED_STATE.config);
        }

        // Error toaster handlings (Avoid infinite loop)
        if (!_.isEqual(this.props.error, nextProps.error)) {
            if (nextProps.error) {
                toastr.error(nextProps.error.name, nextProps.error.message, {
                    showCloseButton: false,
                    removeOnHover: false,
                })
                this.setState({ hasErrorToast: true })
            } else {
                if (this.state.hasErrorToast) {
                    toastr.removeByType("error")
                    this.setState({ hasErrorToast: false })
                }
            }
        }
    }

    componentDidMount() {
        window.addEventListener("focus", this.onBackgroundReload, true)
    }

    componentWillUnmount() {
        window.removeEventListener("focus", this.onBackgroundReload)
    }

    onChangeFilterWord(word) {
        this.props.onChangeFilter({ ...this.props.filter, ...{ word } })
    }

    onBackgroundReload() {
        if (readyToLoadingTasks(this.props.config)) {
            this.props.onBackgroundReload()
        }
    }

    render() {
        const needsValidTodoistToken = !this.props.token || this.props.tokenUpdateError
        const needsLogin = this.props.auth.isLoaded && this.props.auth.isEmpty

        if (needsValidTodoistToken) {
            return (
                <Container textAlign="center" style={{ marginTop: 60 }}>
                    <Steps activeGroupIndex={0} />
                    <Form onSubmit={() => this.props.onUpdateToken(this.state.inputToken)}>
                        <Form.Field inline required>
                            <label>
                                <Icon name="pencil" />Todoist API token
                            </label>
                            <Form.Input
                                type="password"
                                name="todoistToken"
                                value={this.state.inputToken}
                                onChange={(e, { name, value }) => this.setState({ inputToken: value })}
                            />
                        </Form.Field>
                        <Button loading={this.props.isTokenUpdating}>Submit</Button>
                        <Message error visible={!!this.props.tokenUpdateError}>
                            Token is invalid!!
                        </Message>
                    </Form>
                </Container>
            )
        }

        if (needsLogin) {
            return (
                <Container textAlign="center" style={{ marginTop: 60 }}>
                    <Steps activeGroupIndex={1} />
                    <div style={{ padding: 50 }}>
                        <Button color="google plus" onClick={() => this.props.onLogin("google")}>
                            Login with Google
                        </Button>
                    </div>
                </Container>
            )
        }

        if (!readyToLoadingTasks(this.props.config)) {
            return (
                <div>
                    <Dimmer active page>
                        <Loader
                            content="Loading settings of your account..."
                            size="huge"
                            active={this.props.isLoading}
                        />
                    </Dimmer>
                </div>
            )
        }

        return (
            <div>
                <NavigationMenu
                    projects={this.props.projects}
                    labels={this.props.labels}
                    config={this.props.config}
                    uiConfig={this.props.uiConfig}
                    isLoading={this.props.isLoading}
                    onReload={this.props.onReload}
                    onLogout={this.props.onLogout}
                    onChangeConfig={this.props.onChangeConfig}
                    onChangeUiConfig={this.props.onChangeUiConfig}
                />
                <div style={{ padding: 10, marginTop: 70 }}>
                    <Dimmer active={this.props.isLoading && this.props.guardLoading} page>
                        <Loader
                            content="Loading"
                            size="huge"
                            active={this.props.isLoading && this.props.guardLoading}
                        />
                    </Dimmer>
                    <div
                        style={
                            this.props.uiConfig.filter
                                ? {
                                      opacity: 1,
                                      maxHeight: "100%",
                                      transformOrigin: "top",
                                      transition: "all 0.5s",
                                  }
                                : {
                                      opacity: 0,
                                      maxHeight: 0,
                                      transformOrigin: "top",
                                      transition: "all 0.5s",
                                  }
                        }
                    >
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, paddingBottom: 20 }}>
                            <Input
                                placeholder="Filter task name by regexp"
                                icon="filter"
                                iconPosition="left"
                                style={{ width: 300, marginRight: 20 }}
                                onChange={(e, data) => this.onChangeFilterWord(data.value)}
                            />
                            <IconFilter
                                icons={_(this.props.tasks)
                                    .map(t => t.icon)
                                    .uniq()
                                    .value()}
                                iconDisabledMap={this.props.filter.iconDisabledMap}
                                onChangeIconDisabledMap={iconDisabledMap =>
                                    this.props.onChangeFilter({ ...this.props.filter, ...{ iconDisabledMap } })
                                }
                            />
                        </div>
                    </div>
                    <div
                        style={
                            this.props.uiConfig.icebox
                                ? {
                                      overflowY: "scroll",
                                      position: "fixed",
                                      height: "85vh",
                                      transition: "all 0.5s",
                                  }
                                : {
                                      transform: "translate(-400px)",
                                      transition: "all 0.5s",
                                      position: "fixed",
                                  }
                        }
                    >
                        <Icebox
                            tasks={this.props.tasks.filter(x => !x.dueDate)}
                            taskSortField={this.props.uiConfig.taskSortField}
                            taskOrder={this.props.uiConfig.taskOrder}
                            milestone={this.props.uiConfig.milestone}
                            seal={this.props.uiConfig.seal}
                            filter={this.props.uiConfig.filter ? this.props.filter : undefined}
                            onUpdateTask={this.props.onUpdateTask}
                            onRemoveTask={this.props.onRemoveTask}
                            width={350}
                        />
                    </div>
                    <div
                        style={
                            this.props.uiConfig.icebox
                                ? {
                                      transform: "scale(0.9, 0.9)",
                                      transformOrigin: "top",
                                      transition: "all 0.5s",
                                      marginLeft: 350,
                                  }
                                : {
                                      transformOrigin: "top",
                                      transition: "all 0.5s",
                                  }
                        }
                    >
                        <DailyCards
                            baseDate={moment()}
                            tasks={this.props.tasks.filter(x => x.dueDate)}
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
                            onRemoveTask={this.props.onRemoveTask}
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
        )
    }
}

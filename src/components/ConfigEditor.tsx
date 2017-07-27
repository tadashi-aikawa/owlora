import * as React from 'react';
import {Accordion, Checkbox, Divider, Form, Icon, Message, Radio, Segment, SemanticWIDTHS} from 'semantic-ui-react';
import {safeLoad} from 'js-yaml';
import CommonConfig from '../models/CommonConfig';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import Project from '../models/Project';
import Label from '../models/Label';

export interface ConfigEditorProps {
    defaultConfig: CommonConfig
    projects: Project[],
    labels: Label[],
    onSaveConfig: (config: CommonConfig) => void;
}

export interface ConfigEditorState {
    todoistToken: string;
    estimatedLabels: string;
    milestoneLabel: number;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: string;
    iconsByProject: string;
    colorsByTaskNameRegexp: string;
    taskSortField: TaskSortField;
    taskOrder: Order;
    numberOfCardsPerRow: SemanticWIDTHS;

    validationError?: string;
}

export default class extends React.Component<ConfigEditorProps, ConfigEditorState> {

    state: ConfigEditorState = {
        todoistToken: this.props.defaultConfig.todoistToken,
        estimatedLabels: this.props.defaultConfig.estimatedLabels.yaml,
        milestoneLabel: this.props.defaultConfig.milestoneLabel,
        minutesToUsePerDay: this.props.defaultConfig.minutesToUsePerDay,
        minutesToUsePerSpecificDays: this.props.defaultConfig.minutesToUsePerSpecificDays.yaml,
        iconsByProject: this.props.defaultConfig.iconsByProject.yaml,
        colorsByTaskNameRegexp: this.props.defaultConfig.colorsByTaskNameRegexp.yaml,
        taskSortField: this.props.defaultConfig.taskSortField,
        taskOrder: this.props.defaultConfig.taskOrder,
        numberOfCardsPerRow: this.props.defaultConfig.numberOfCardsPerRow
    };

    handleChange = (e, {name, value}) =>
        this.setState(Object.assign({}, this.state, {[name]: value}));

    handleTaskOrderChange = (e, {value}) =>
        this.setState(Object.assign({}, this.state, {taskSortField: value}));

    handleSubmit = e => {
        try {
            this.setState(Object.assign({}, this.state, {validationError: ""}));
            this.props.onSaveConfig({
                todoistToken: this.state.todoistToken,
                estimatedLabels: {
                    dict: this.state.estimatedLabels ?
                        safeLoad(this.state.estimatedLabels) : {},
                    yaml: this.state.estimatedLabels,
                },
                milestoneLabel: this.state.milestoneLabel && Number(this.state.milestoneLabel),
                minutesToUsePerDay: this.state.minutesToUsePerDay && Number(this.state.minutesToUsePerDay),
                minutesToUsePerSpecificDays: {
                    dict: this.state.minutesToUsePerSpecificDays ?
                        safeLoad(this.state.minutesToUsePerSpecificDays) : {},
                    yaml: this.state.minutesToUsePerSpecificDays,
                },
                iconsByProject: {
                    dict: this.state.iconsByProject ?
                        safeLoad(this.state.iconsByProject) : {},
                    yaml: this.state.iconsByProject,
                },
                colorsByTaskNameRegexp: {
                    dict: this.state.colorsByTaskNameRegexp ?
                        safeLoad(this.state.colorsByTaskNameRegexp) : {},
                    yaml: this.state.colorsByTaskNameRegexp,
                },
                taskSortField: this.state.taskSortField,
                taskOrder: this.state.taskOrder,
                numberOfCardsPerRow: this.state.numberOfCardsPerRow as SemanticWIDTHS,
            });
        } catch (e) {
            this.setState(Object.assign({}, this.state, {validationError: e.toString()}));
        }
    };

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Segment>
                    <Form.Field inline required>
                        <label><Icon name="pencil"/>Todoist API token</label>
                        <Form.Input type="password"
                                    name="todoistToken"
                                    value={this.state.todoistToken}
                                    onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Divider section/>
                    <Form.Field inline required>
                        <label><Icon name="pencil"/>Estimated Labels</label>
                        <Form.TextArea name="estimatedLabels"
                                       placeholder='Estimated labels as yaml (key is label id)'
                                       value={this.state.estimatedLabels}
                                       onChange={this.handleChange}
                                       autoHeight
                        />
                    </Form.Field>
                    <Form.Field inline>
                        <label><Icon name="pencil"/>Milestone label id</label>
                        <Form.Input type="number"
                                    name="milestoneLabel"
                                    value={this.state.milestoneLabel}
                                    onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Accordion styled panels={[{
                        title: 'Show all labels',
                        content: <ul>
                            {this.props.labels.map(l => <li key={l.id}>{l.id}: {l.name}</li>)}
                        </ul>
                    }]}/>
                    <Divider section/>
                    <Form.Field inline required>
                        <label><Icon name="pencil"/>Minutes to use per day</label>
                        <Form.Input type="number"
                                    name="minutesToUsePerDay"
                                    value={this.state.minutesToUsePerDay}
                                    onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Divider section/>
                    <Form.Field inline>
                        <label><Icon name="pencil"/>Minutes to use per specific days</label>
                        <Form.TextArea name="minutesToUsePerSpecificDays"
                                       placeholder='Specific days as yaml (key is yyyyMMdd)'
                                       value={this.state.minutesToUsePerSpecificDays}
                                       onChange={this.handleChange}
                                       autoHeight
                        />
                    </Form.Field>
                    <Divider section/>
                    <Form.Field inline>
                        <label><Icon name="pencil"/>Icons by project id</label>
                        <Form.TextArea name="iconsByProject"
                                       placeholder='Icon urls by projects as yaml (key is project id)'
                                       value={this.state.iconsByProject}
                                       onChange={this.handleChange}
                                       autoHeight
                        />
                    </Form.Field>
                    <Accordion styled panels={[{
                        title: 'Show all projects',
                        content: <ul>
                            {this.props.projects.map(p => <li key={p.id}>{p.id}: {p.name}</li>)}
                        </ul>
                    }]}/>
                    <Divider section/>
                    <Form.Field inline>
                        <label><Icon name="pencil"/>Colors by task name regexp</label>
                        <Form.TextArea name="colorsByTaskNameRegexp"
                                       placeholder='Task name regexp and color used'
                                       value={this.state.colorsByTaskNameRegexp}
                                       onChange={this.handleChange}
                                       autoHeight
                        />
                    </Form.Field>
                    <Divider section/>
                    <Form.Field>
                        <Form.Field>
                            <label><Icon name="pencil"/>Sort order for task</label>
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Project ID'
                                name='radioGroup'
                                value={TaskSortField.PROJECT_NAME}
                                checked={this.state.taskSortField === TaskSortField.PROJECT_NAME}
                                onChange={this.handleTaskOrderChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Day order'
                                name='radioGroup'
                                value={TaskSortField.DAY_ORDER}
                                checked={this.state.taskSortField === TaskSortField.DAY_ORDER}
                                onChange={this.handleTaskOrderChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Task name'
                                name='radioGroup'
                                value={TaskSortField.TASK_NAME}
                                checked={this.state.taskSortField === TaskSortField.TASK_NAME}
                                onChange={this.handleTaskOrderChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Estimated minutes'
                                name='radioGroup'
                                value={TaskSortField.ESTIMATED_MINUTES}
                                checked={this.state.taskSortField === TaskSortField.ESTIMATED_MINUTES}
                                onChange={this.handleTaskOrderChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox checked={this.state.taskOrder === Order.DESC}
                                      label="Descend"
                                      onChange={
                                          () => this.setState(
                                              Object.assign({}, this.state, {
                                                  taskOrder: this.state.taskOrder === Order.ASC ? Order.DESC : Order.ASC
                                              })
                                          )
                                      }
                                      toggle/>
                        </Form.Field>
                    </Form.Field>
                    <Divider section/>
                    <Form.Field inline required>
                        <label><Icon name="pencil"/>A Number of cards per row (default)</label>
                        <Form.Input type="number"
                                    name="numberOfCardsPerRow"
                                    min={1}
                                    max={5}
                                    value={this.state.numberOfCardsPerRow}
                                    onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Divider section/>
                    <Form.Button accessKey="s" content='Save'/>
                    <Message error visible={!!this.state.validationError}>
                        {this.state.validationError}
                    </Message>
                </Segment>
            </Form>
        );
    }
}

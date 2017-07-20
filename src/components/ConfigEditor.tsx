import * as React from 'react';
import {Radio, Message, Form, Grid, Checkbox} from 'semantic-ui-react';
import {safeDump, safeLoad} from 'js-yaml';
import CommonConfig from '../models/CommonConfig';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';

export interface ConfigEditorProps {
    defaultConfig: CommonConfig
    onSaveConfig: (config: CommonConfig) => void;
}

export interface ConfigEditorState {
    todoistToken: string;
    estimatedLabels: string;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: string;
    iconsByProject: string;
    taskSortField: TaskSortField;
    taskOrder: Order;

    validationError?: string;
}

export default class extends React.Component<ConfigEditorProps, ConfigEditorState> {

    state: ConfigEditorState = {
        todoistToken: this.props.defaultConfig.todoistToken,
        estimatedLabels: safeDump(this.props.defaultConfig.estimatedLabels),
        minutesToUsePerDay: this.props.defaultConfig.minutesToUsePerDay,
        minutesToUsePerSpecificDays: safeDump(this.props.defaultConfig.minutesToUsePerSpecificDays),
        iconsByProject: safeDump(this.props.defaultConfig.iconsByProject),
        taskSortField: this.props.defaultConfig.taskSortField,
        taskOrder: this.props.defaultConfig.taskOrder,
    };

    handleChange = (e, {name, value}) =>
        this.setState(Object.assign({}, this.state, {[name]: value}));

    handleTaskOrderChange = (e, {value}) =>
        this.setState(Object.assign({}, this.state, {taskSortField: value}));

    handleSubmit = e => {
        try {
            const estimatedLabels = safeLoad(this.state.estimatedLabels);
            const minutesToUsePerSpecificDays = safeLoad(this.state.minutesToUsePerSpecificDays);
            const iconsByProject = safeLoad(this.state.iconsByProject);

            this.setState(Object.assign({}, this.state, {validationError: ""}));
            this.props.onSaveConfig({
                todoistToken: this.state.todoistToken,
                estimatedLabels,
                minutesToUsePerDay: Number(this.state.minutesToUsePerDay),
                minutesToUsePerSpecificDays,
                iconsByProject,
                taskSortField: this.state.taskSortField,
                taskOrder: this.state.taskOrder,
            });
        } catch (e) {
            this.setState(Object.assign({}, this.state, {validationError: e.toString()}));
        }
    };

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Grid>
                    <Form.Field inline>
                        <label>Todoist API token</label>
                        <Form.Input type="password"
                                    name="todoistToken"
                                    value={this.state.todoistToken}
                                    onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field inline>
                        <Form.TextArea name="estimatedLabels"
                                       label='estimatedLabels'
                                       placeholder='Estimated labels as yaml (key is label id)'
                                       value={this.state.estimatedLabels}
                                       onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field inline>
                        <label>Minutes to use per day</label>
                        <Form.Input type="number"
                                    name="minutesToUsePerDay"
                                    value={this.state.minutesToUsePerDay}
                                    onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field inline>
                        <Form.TextArea name="minutesToUsePerSpecificDays"
                                       label='minutesToUsePerSpecificDays'
                                       placeholder='Specific days as yaml (key is yyyyMMdd)'
                                       value={this.state.minutesToUsePerSpecificDays}
                                       onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field inline>
                        <Form.TextArea name="iconsByProject"
                                       label='iconsByProject'
                                       placeholder='Specific icon urls by projects as yaml (key is project id)'
                                       value={this.state.iconsByProject}
                                       onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Field>
                            Sort order for task
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
                                      toggle />
                        </Form.Field>
                    </Form.Field>
                </Grid>
                <Form.Button content='Save'/>
                <Message error visible={!!this.state.validationError}>
                    {this.state.validationError}
                </Message>
            </Form>
        );
    }
}

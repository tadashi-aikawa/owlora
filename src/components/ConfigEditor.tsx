import * as React from 'react';
import {Accordion, Divider, Form, Icon, Message, Segment} from 'semantic-ui-react';
import {safeLoad} from 'js-yaml';
import CommonConfig from '../models/CommonConfig';
import Project from '../models/Project';
import Label from '../models/Label';

const MILESTONES_PLACEHOLDER = `By yaml
---------------

- color: green
  condition:
    regexp: vacation
    labelIdsOr: [2148194362]
- color: red
  size: huge  # (mini | tiny | small(default) | large | big | huge | massive)
  condition:
    labelIdsOr: [2148194362]
- color: purple
  condition:
    projectIdsOr: [153016633]
`;

export interface ConfigEditorProps {
    defaultConfig: CommonConfig
    projects: Project[],
    labels: Label[],
    onSaveConfig: (config: CommonConfig) => void;
}

export interface ConfigEditorState {
    todoistToken: string;
    estimatedLabels: string;
    milestones: string;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: string;
    iconsByProject: string;
    colorsByTaskNameRegexp: string;

    validationError?: string;
}

export default class extends React.Component<ConfigEditorProps, ConfigEditorState> {

    state: ConfigEditorState = {
        todoistToken: this.props.defaultConfig.todoistToken,
        estimatedLabels: this.props.defaultConfig.estimatedLabels.yaml,
        milestones: this.props.defaultConfig.milestones.yaml,
        minutesToUsePerDay: this.props.defaultConfig.minutesToUsePerDay,
        minutesToUsePerSpecificDays: this.props.defaultConfig.minutesToUsePerSpecificDays.yaml,
        iconsByProject: this.props.defaultConfig.iconsByProject.yaml,
        colorsByTaskNameRegexp: this.props.defaultConfig.colorsByTaskNameRegexp.yaml,
    };

    handleChange = (e, {name, value}) =>
        this.setState(Object.assign({}, this.state, {[name]: value}));

    handleSubmit = () => {
        try {
            this.setState(Object.assign({}, this.state, {validationError: ""}));
            this.props.onSaveConfig({
                todoistToken: this.state.todoistToken,
                estimatedLabels: {
                    dict: this.state.estimatedLabels ?
                        safeLoad(this.state.estimatedLabels) : {},
                    yaml: this.state.estimatedLabels,
                },
                milestones: {
                    array: this.state.milestones ?
                        safeLoad(this.state.milestones) : {},
                    yaml: this.state.milestones,
                },
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
                    <Form.Field inline required>
                        <label><Icon name="pencil"/>Milestones</label>
                        <Form.TextArea name="milestones"
                                       placeholder={MILESTONES_PLACEHOLDER}
                                       value={this.state.milestones}
                                       onChange={this.handleChange}
                                       autoHeight
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
                    <Form.Button accessKey="s" content='Save'/>
                    <Message error visible={!!this.state.validationError}>
                        {this.state.validationError}
                    </Message>
                </Segment>
            </Form>
        );
    }
}

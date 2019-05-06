import * as _ from 'lodash';
import * as React from 'react';
import {Button, Divider, Form, Grid, Icon, Menu, Message, Segment, Tab} from 'semantic-ui-react';
import {version} from '../../../package.json';
import CommonConfig, {ArrayAndYaml, DictAndYaml} from '../../models/CommonConfig';
import ConfigImporter from './ConfigImporter';
import ConfigInfo from './ConfigInfo';

const MILESTONES_PLACEHOLDER = `By yaml
---------------

- color: green  # See https://react.semantic-ui.com/elements/segment#segment-example-colored-inverted
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

const SEALS_PLACEHOLDER = `By yaml
---------------

- color: green  # See https://react.semantic-ui.com/elements/segment#segment-example-colored-inverted
  condition:
    regexp: vacation
    labelIdsOr: [2148194362]
- color: purple
  condition:
    projectIdsOr: [153016633]
`;

const ESTIMATES_PLACEHOLDER = `By yaml
---------------

- minutes: 5
  condition:
    regexp: " @5min"
    labelId: 2148194362
    projectId: 153016592
- minutes: 15
  condition:
    regexp: " @15min"
`;

export interface ConfigEditorProps {
    defaultConfig: CommonConfig
    onSaveConfig: (config: CommonConfig) => void;
}

export interface ConfigEditorState {
    activeItem: 'time' | 'visual' | 'import/export' | 'account' | 'info';

    activeTimeTabIndex: number,
    activeVisualTabIndex: number,

    estimates: string;
    milestones: string;
    seals: string;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: string;
    lampTimeBegin: number;
    lampTimeEnd: number;
    iconsByProject: string;
    colorsByTaskNameRegexp: string;

    validationError?: string;
}

export default class extends React.Component<ConfigEditorProps, ConfigEditorState> {

    state: ConfigEditorState = {
        activeItem: 'time',
        activeTimeTabIndex: 0,
        activeVisualTabIndex: 0,
        estimates: ArrayAndYaml.toYaml(this.props.defaultConfig.estimates),
        milestones: ArrayAndYaml.toYaml(this.props.defaultConfig.milestones),
        seals: ArrayAndYaml.toYaml(this.props.defaultConfig.seals),
        minutesToUsePerDay: this.props.defaultConfig.minutesToUsePerDay,
        minutesToUsePerSpecificDays: DictAndYaml.toYaml(this.props.defaultConfig.minutesToUsePerSpecificDays),
        lampTimeBegin: this.props.defaultConfig.lampTime.begin,
        lampTimeEnd: this.props.defaultConfig.lampTime.end,
        iconsByProject: DictAndYaml.toYaml(this.props.defaultConfig.iconsByProject),
        colorsByTaskNameRegexp: DictAndYaml.toYaml(this.props.defaultConfig.colorsByTaskNameRegexp),
    };

    handleChange = (e, {name, value}) =>
        this.setState(Object.assign({}, this.state, {[name]: value}));

    handleItemClick = (e, {name}) => this.setState({activeItem: name})

    handleSave = () => {
        try {
            this.setState(Object.assign({}, this.state, {validationError: ""}));
            this.props.onSaveConfig({
                estimates: ArrayAndYaml.fromYaml(this.state.estimates),
                milestones: ArrayAndYaml.fromYaml(this.state.milestones),
                seals: ArrayAndYaml.fromYaml(this.state.seals),
                minutesToUsePerDay: this.state.minutesToUsePerDay && Number(this.state.minutesToUsePerDay),
                minutesToUsePerSpecificDays: DictAndYaml.fromYaml(this.state.minutesToUsePerSpecificDays),
                lampTime: {
                    begin: this.state.lampTimeBegin,
                    end: this.state.lampTimeEnd,
                },
                iconsByProject: DictAndYaml.fromYaml(this.state.iconsByProject),
                colorsByTaskNameRegexp: DictAndYaml.fromYaml(this.state.colorsByTaskNameRegexp),
            });
        } catch (e) {
            this.setState(Object.assign({}, this.state, {validationError: e.toString()}));
        }
    };

    handleTimeTabChange = (e, {activeIndex}) => this.setState({activeTimeTabIndex: activeIndex})
    handleVisualTabChange = (e, {activeIndex}) => this.setState({activeVisualTabIndex: activeIndex})

    render() {
        const timePanes = [
            {
                menuItem: 'Day', render: () => <Tab.Pane>
                    <Form.Field inline required>
                        <label>Minutes to use per day</label>
                        <Form.Input type="number"
                                    name="minutesToUsePerDay"
                                    value={this.state.minutesToUsePerDay}
                                    onChange={this.handleChange}
                        />
                    </Form.Field>
                </Tab.Pane>
            },
            {
                menuItem: 'Specific days', render: () => <Tab.Pane>
                    <Form.Field>
                        <label>Minutes to use per specific days</label>
                        <Form.TextArea name="minutesToUsePerSpecificDays"
                                       placeholder='Specific days as yaml (key is yyyyMMdd)'
                                       value={this.state.minutesToUsePerSpecificDays}
                                       onChange={this.handleChange}
                                       style={{width: "100%", height: "50vh", padding: "10px"}}
                        />
                    </Form.Field>
                </Tab.Pane>
            },
            {
                menuItem: 'Estimates', render: () => <Tab.Pane>
                    <Form.Field required>
                        <Form.TextArea name="estimates"
                                       placeholder={ESTIMATES_PLACEHOLDER}
                                       value={this.state.estimates}
                                       onChange={this.handleChange}
                                       style={{width: "100%", height: "50vh", padding: "10px"}}
                        />
                    </Form.Field>
                </Tab.Pane>
            },
            {
                menuItem: 'Time lamps', render: () => <Tab.Pane>
                    <Form.Field inline required>
                        <label>Begin hour</label>
                        <Form.Input type="number"
                                    name="lampTimeBegin"
                                    value={this.state.lampTimeBegin}
                                    min={0}
                                    max={23}
                                    onChange={this.handleChange}
                        />
                        <label>End hour</label>
                        <Form.Input type="number"
                                    name="lampTimeEnd"
                                    value={this.state.lampTimeEnd}
                                    min={0}
                                    max={23}
                                    onChange={this.handleChange}
                        />
                    </Form.Field>
                </Tab.Pane>
            }
        ]

        const visualPanes = [
            {
                menuItem: 'Milestones', render: () => <Tab.Pane>
                    <Form.Field>
                        <Form.TextArea name="milestones"
                                       placeholder={MILESTONES_PLACEHOLDER}
                                       value={this.state.milestones}
                                       onChange={this.handleChange}
                                       style={{width: "100%", height: "50vh", padding: "10px"}}
                        />
                    </Form.Field>
                </Tab.Pane>
            },
            {
                menuItem: 'Seals', render: () => <Tab.Pane>
                    <Form.Field>
                        <Form.TextArea name="seals"
                                       placeholder={SEALS_PLACEHOLDER}
                                       value={this.state.seals}
                                       onChange={this.handleChange}
                                       style={{width: "100%", height: "50vh", padding: "10px"}}
                        />
                    </Form.Field>
                </Tab.Pane>
            },
            {
                menuItem: 'Icons', render: () => <Tab.Pane>
                    <Form.Field>
                        <label>Icons by project id</label>
                        <Form.TextArea name="iconsByProject"
                                       placeholder='Icon urls by projects as yaml (key is project id)'
                                       value={this.state.iconsByProject}
                                       onChange={this.handleChange}
                                       style={{width: "100%", height: "50vh", padding: "10px"}}
                        />
                    </Form.Field>
                </Tab.Pane>
            },
            {
                menuItem: 'Colors', render: () => <Tab.Pane>
                    <Form.Field>
                        <label>Colors by task name regexp</label>
                        <Form.TextArea name="colorsByTaskNameRegexp"
                                       placeholder='Task name regexp and color used'
                                       value={this.state.colorsByTaskNameRegexp}
                                       onChange={this.handleChange}
                                       style={{width: "100%", height: "50vh", padding: "10px"}}
                        />
                    </Form.Field>
                </Tab.Pane>
            },
        ]
        return (
            <div>
                {
                    !!this.state.validationError &&
                    <Message error icon>
                        <Icon name='warning sign'/>
                        {this.state.validationError}
                    </Message>
                }
                <Grid>
                    <Grid.Column width={4}>
                        <Menu fluid vertical tabular icon="labeled">
                            <Menu.Item name='time' active={this.state.activeItem === 'time'}
                                       onClick={this.handleItemClick}>
                                <Icon name='time'/>
                                Time
                            </Menu.Item>
                            <Menu.Item name='visual' active={this.state.activeItem === 'visual'}
                                       onClick={this.handleItemClick}>
                                <Icon name='eye'/>
                                Visual
                            </Menu.Item>
                            <Menu.Item name='import/export' active={this.state.activeItem === 'import/export'}
                                       onClick={this.handleItemClick}>
                                <Icon name='file outline'/>
                                Import / Export
                            </Menu.Item>
                            <Menu.Item name='account' active={this.state.activeItem === 'account'}
                                       onClick={this.handleItemClick}>
                                <Icon name='user'/>
                                Account
                            </Menu.Item>
                            <Menu.Item name='info' active={this.state.activeItem === 'info'}
                                       onClick={this.handleItemClick}>
                                <Icon name='info'/>
                                Information
                            </Menu.Item>
                        </Menu>
                        <Button
                            attached='bottom'
                            content='Save'
                            icon='save'
                            onClick={this.handleSave}
                        />
                    </Grid.Column>

                    <Grid.Column stretched width={12}>
                        {
                            this.state.activeItem === 'time' ?
                                <Tab panes={timePanes}
                                     activeIndex={this.state.activeTimeTabIndex}
                                     onTabChange={this.handleTimeTabChange}/> :
                                this.state.activeItem === 'visual' ?
                                    <Tab panes={visualPanes}
                                         activeIndex={this.state.activeVisualTabIndex}
                                         onTabChange={this.handleVisualTabChange}/> :
                                    this.state.activeItem === 'import/export' ?
                                        <ConfigImporter config={_.omit(this.state, ['activeItem', 'todoistToken'])}
                                                        onImport={newState => this.setState(
                                                            Object.assign(newState as ConfigEditorState, {activeItem: "main"})
                                                        )}
                                        />
                                        :
                                        this.state.activeItem === 'account' ?
                                            <span>TODO</span>
                                            :
                                            this.state.activeItem === 'info' ? <ConfigInfo version={version}/> : ""
                        }
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

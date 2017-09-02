import * as _ from 'lodash';
import * as React from 'react';
import {Button, Divider, Form, Grid, Icon, Menu, Message, Segment} from 'semantic-ui-react';
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

    estimates: string;
    milestones: string;
    seals: string;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: string;
    iconsByProject: string;
    colorsByTaskNameRegexp: string;

    validationError?: string;
}

export default class extends React.Component<ConfigEditorProps, ConfigEditorState> {

    state: ConfigEditorState = {
        activeItem: 'time',
        estimates: ArrayAndYaml.toYaml(this.props.defaultConfig.estimates),
        milestones: ArrayAndYaml.toYaml(this.props.defaultConfig.milestones),
        seals: ArrayAndYaml.toYaml(this.props.defaultConfig.seals),
        minutesToUsePerDay: this.props.defaultConfig.minutesToUsePerDay,
        minutesToUsePerSpecificDays: DictAndYaml.toYaml(this.props.defaultConfig.minutesToUsePerSpecificDays),
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
                iconsByProject: DictAndYaml.fromYaml(this.state.iconsByProject),
                colorsByTaskNameRegexp: DictAndYaml.fromYaml(this.state.colorsByTaskNameRegexp),
            });
        } catch (e) {
            this.setState(Object.assign({}, this.state, {validationError: e.toString()}));
        }
    };

    render() {
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
                        <Segment>
                            {
                                this.state.activeItem === 'visual' ?
                                    <Form>
                                        <Form.Field>
                                            <label><Icon name="pencil"/>Milestones</label>
                                            <Form.TextArea name="milestones"
                                                           placeholder={MILESTONES_PLACEHOLDER}
                                                           value={this.state.milestones}
                                                           onChange={this.handleChange}
                                                           autoHeight
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label><Icon name="pencil"/>Seals</label>
                                            <Form.TextArea name="seals"
                                                           placeholder={SEALS_PLACEHOLDER}
                                                           value={this.state.seals}
                                                           onChange={this.handleChange}
                                                           autoHeight
                                            />
                                        </Form.Field>
                                        <Form.Field inline>
                                            <label><Icon name="pencil"/>Icons by project id</label>
                                            <Form.TextArea name="iconsByProject"
                                                           placeholder='Icon urls by projects as yaml (key is project id)'
                                                           value={this.state.iconsByProject}
                                                           onChange={this.handleChange}
                                                           autoHeight
                                            />
                                        </Form.Field>
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
                                    </Form>
                                    :
                                    this.state.activeItem === 'time' ?
                                        <Form>
                                            <Form.Field inline required>
                                                <label><Icon name="pencil"/>Minutes to use per day</label>
                                                <Form.Input type="number"
                                                            name="minutesToUsePerDay"
                                                            value={this.state.minutesToUsePerDay}
                                                            onChange={this.handleChange}
                                                />
                                            </Form.Field>
                                            <Form.Field inline>
                                                <label><Icon name="pencil"/>Minutes to use per specific days</label>
                                                <Form.TextArea name="minutesToUsePerSpecificDays"
                                                               placeholder='Specific days as yaml (key is yyyyMMdd)'
                                                               value={this.state.minutesToUsePerSpecificDays}
                                                               onChange={this.handleChange}
                                                               autoHeight
                                                />
                                            </Form.Field>
                                            <Form.Field inline required>
                                                <label><Icon name="pencil"/>Estimates</label>
                                                <Form.TextArea name="estimates"
                                                               placeholder={ESTIMATES_PLACEHOLDER}
                                                               value={this.state.estimates}
                                                               onChange={this.handleChange}
                                                               autoHeight
                                                />
                                            </Form.Field>
                                        </Form>
                                        :
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
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

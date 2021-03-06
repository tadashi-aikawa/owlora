import '../../package';

import * as _ from 'lodash';
import * as React from 'react';
import {Component} from 'react';
import {Button, Dropdown, Header, Icon, Input, Menu, Modal, Popup, Segment, SemanticWIDTHS} from 'semantic-ui-react';
import CommonConfig from '../models/CommonConfig';
import ConfigEditor from './config/ConfigEditor';
import Project from '../models/Project';
import Label from '../models/Label';
import {DragDropContext} from 'react-dnd';

import UiConfig from '../models/UiConfig';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import Emojify from 'react-emojione';
import Trashbox from "./Trashbox";

const LOGO = require('../../owlora.png');


const isMobile = () => {
    return window.innerWidth < 1400;
};

const updateUiConfig = (uiConfig, onChangeUiConfig, property: Object) =>
    onChangeUiConfig(Object.assign({}, uiConfig, property));

const ToggleButton = ({enabled, icon, onChange}: {
    enabled: boolean, icon: string, onChange: (enabled: boolean) => void
}) =>
    <Button icon={icon}
            color={enabled ? "teal" : "grey"}
            onClick={() => onChange(!enabled)}/>;

const ToggleButtonGroup = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <Button.Group>
            <ToggleButton
                icon="inbox"
                enabled={uiConfig.icebox}
                onChange={enabled => updateUiConfig(uiConfig, onChangeUiConfig, {icebox: enabled})}/>
            <ToggleButton
                icon="filter"
                enabled={uiConfig.filter}
                onChange={enabled => updateUiConfig(uiConfig, onChangeUiConfig, {filter: enabled})}/>
            <ToggleButton
                icon="tasks"
                enabled={uiConfig.isTasksExpanded}
                onChange={enabled => updateUiConfig(uiConfig, onChangeUiConfig, {isTasksExpanded: enabled})}/>
            <ToggleButton
                icon="time"
                enabled={uiConfig.timeLamps}
                onChange={enabled => updateUiConfig(uiConfig, onChangeUiConfig, {timeLamps: enabled})}/>
            <ToggleButton
                icon="diamond"
                enabled={uiConfig.milestone}
                onChange={enabled => updateUiConfig(uiConfig, onChangeUiConfig, {milestone: enabled})}/>
            <ToggleButton
                icon="ticket"
                enabled={uiConfig.seal}
                onChange={enabled => updateUiConfig(uiConfig, onChangeUiConfig, {seal: enabled})}/>
            <ToggleButton
                icon="warning sign"
                enabled={uiConfig.warning}
                onChange={enabled => updateUiConfig(uiConfig, onChangeUiConfig, {warning: enabled})}/>
        </Button.Group>
    </Menu.Item>;

const DayAppearanceToggle = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <Button.Group>
            <Button toggle
                    active={uiConfig.onlyWeekday}
                    onClick={() => onChangeUiConfig(
                        Object.assign({}, uiConfig, {onlyWeekday: true})
                    )}>
                Weekday
            </Button>
            <Button.Or/>
            <Button toggle
                    active={!uiConfig.onlyWeekday}
                    onClick={() => onChangeUiConfig(
                        Object.assign({}, uiConfig, {onlyWeekday: false})
                    )}>
                All Day
            </Button>
        </Button.Group>
    </Menu.Item>;

const SortOrderSelector = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <Button icon={Order.iconNames[uiConfig.taskOrder]}
                onClick={() => onChangeUiConfig(
                    Object.assign({}, uiConfig, {taskOrder: Order.inverses[uiConfig.taskOrder]})
                )}
        />
        <Dropdown floating
                  button
                  search
                  text={uiConfig.taskSortField}
                  onChange={(e, {value}: { value: TaskSortField }) => onChangeUiConfig(
                      Object.assign({}, uiConfig, {taskSortField: value})
                  )}
                  options={
                      _.map(TaskSortField.toObject, v => ({
                          key: v,
                          text: v,
                          value: v
                      }))
                  }
        />
    </Menu.Item>;

const CardColumnsNumSelector = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <Dropdown text={String(uiConfig.numberOfCardsPerRow)}
                  search labeled button floating compact
                  className="icon" icon="columns"
                  onChange={(e, {value}: { value: string }) => onChangeUiConfig(
                      Object.assign({}, uiConfig, {numberOfCardsPerRow: value as SemanticWIDTHS})
                  )}
                  options={
                      _.map(_.range(1, 7 + 1), v => ({
                          key: `${v}`,
                          text: `${v} col`,
                          value: `${v}`
                      }))
                  }/>
    </Menu.Item>;

const CardNumSelector = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <Dropdown text={String(uiConfig.numberOfCards)}
                  search labeled button floating compact
                  className="icon" icon="calendar"
                  onChange={(e, {value}: { value: string }) => onChangeUiConfig(
                      Object.assign({}, uiConfig, {numberOfCards: Number(value)})
                  )}
                  options={
                      _.map(_.range(1, 180 + 1), v => ({
                          key: `${v}`,
                          text: `${v} days`,
                          value: `${v}`
                      }))
                  }/>
    </Menu.Item>;


export interface NavigationMenuProps {
    projects: Project[];
    labels: Label[];

    config: CommonConfig;
    uiConfig: UiConfig;

    isLoading: boolean;

    onReload: () => void;
    onChangeConfig: (config: CommonConfig) => void;
    onChangeUiConfig: (config: UiConfig) => void;
    onLogout: () => void;
}

export interface NavigationMenuState {
    isModalOpen: boolean;
    // TODO: Move!
    emojiPreviewStr?: string;
}

export default class extends Component<NavigationMenuProps, NavigationMenuState> {
    state: NavigationMenuState = {isModalOpen: false};
    handleOpen = () => this.setState({isModalOpen: true});
    handleClose = () => this.setState({isModalOpen: false});

    render() {
        return (
            <Menu stackable inverted fixed="top" style={{height: 70}}>
                <Menu.Item>
                    <img src={LOGO} style={{width: 40}}/>
                </Menu.Item>
                <Menu.Item>
                    <h2>Owlora</h2>
                </Menu.Item>
                <Menu.Menu position="right">
                    {
                        isMobile() ?
                            <Menu.Item position="right">
                                <Popup inverted
                                       trigger={<Button icon="eye" inverted/>}
                                       content={
                                           <Menu.Menu style={{
                                               display: "flex",
                                               flexDirection: "column",
                                               justifyContent: "space-around",
                                               height: 150
                                           }}>
                                               <SortOrderSelector uiConfig={this.props.uiConfig}
                                                                  onChangeUiConfig={this.props.onChangeUiConfig}/>
                                               <DayAppearanceToggle uiConfig={this.props.uiConfig}
                                                                    onChangeUiConfig={this.props.onChangeUiConfig}/>
                                               <CardColumnsNumSelector uiConfig={this.props.uiConfig}
                                                                       onChangeUiConfig={this.props.onChangeUiConfig}/>
                                               <CardNumSelector uiConfig={this.props.uiConfig}
                                                                onChangeUiConfig={this.props.onChangeUiConfig}/>
                                           </Menu.Menu>
                                       }
                                       on='click'
                                       position='bottom right'
                                />
                                <ToggleButtonGroup uiConfig={this.props.uiConfig}
                                                   onChangeUiConfig={this.props.onChangeUiConfig}
                                />
                            </Menu.Item>
                            :
                            <Menu.Menu position="right">
                                <DayAppearanceToggle uiConfig={this.props.uiConfig}
                                                     onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <SortOrderSelector uiConfig={this.props.uiConfig}
                                                   onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <CardColumnsNumSelector uiConfig={this.props.uiConfig}
                                                        onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <CardNumSelector uiConfig={this.props.uiConfig}
                                                 onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <ToggleButtonGroup uiConfig={this.props.uiConfig}
                                                   onChangeUiConfig={this.props.onChangeUiConfig}
                                />
                            </Menu.Menu>
                    }
                    <Menu.Item>
                        {
                            this.props.isLoading ?
                                <Icon name="refresh" size="large" loading/>
                                :
                                <Button accessKey="r" icon="refresh" inverted onClick={e => {
                                    e.preventDefault();
                                    this.props.onReload();
                                }}/>
                        }
                    </Menu.Item>
                    <Menu.Item>
                        <Modal size="large"
                               open={this.state.isModalOpen}
                               onClose={this.handleClose}
                               trigger={
                                   <Button accessKey="s" icon inverted onClick={this.handleOpen}>
                                       <Icon name="setting" size="large"/>
                                   </Button>
                               }>
                            <Header>
                                <div style={{display: "flex"}}>
                                    <Icon name="setting"/>
                                    <span>Settings</span>
                                    <div style={{marginLeft: 'auto'}}>
                                        <Popup
                                            on="click"
                                            flowing
                                            size="mini"
                                            position="bottom right"
                                            trigger={<Button icon="smile" circular title="Emoji helper"/>}
                                        >
                                            <Input value={this.state.emojiPreviewStr}
                                                   onChange={(e, {name, value}) => this.setState({emojiPreviewStr: value})}
                                                   labelPosition="right"
                                                   label={<Button title="Go to github to show all emoji" icon='github'
                                                                  as="a"
                                                                  href="https://github.com/pladaria/react-emojione/blob/master/src/data/emoji-data.js"/>}
                                            />
                                            <Segment>
                                                Preview: <Emojify>{this.state.emojiPreviewStr}</Emojify>
                                            </Segment>
                                        </Popup>

                                        <Popup
                                            on="click"
                                            flowing
                                            size="mini"
                                            position="bottom right"
                                            trigger={<Button icon="tags" circular title="Show labels"/>}
                                        >
                                            <div style={{maxHeight: 400, overflowY: "scroll", paddingRight: "20px"}}>
                                                <ul style={{listStyle: "none"}}>
                                                    {this.props.labels.map(l => <li key={l.id}>{l.id}: {l.name}</li>)}
                                                </ul>
                                            </div>
                                        </Popup>
                                        <Popup
                                            on="click"
                                            flowing
                                            size="mini"
                                            position="bottom right"
                                            trigger={<Button icon="object group" circular title="Show projects"/>}
                                        >
                                            <div style={{maxHeight: 400, overflowY: "scroll", paddingRight: "20px"}}>
                                                <ul style={{listStyle: "none"}}>
                                                    {this.props.projects.map(p => <li key={p.id}>{p.id}: {p.name}</li>)}
                                                </ul>
                                            </div>
                                        </Popup>
                                    </div>
                                </div>
                            </Header>
                            <Modal.Content scrolling style={{height: "90vh"}}>
                                <ConfigEditor defaultConfig={this.props.config}
                                              onSaveConfig={(config) => {
                                                  this.handleClose();
                                                  this.props.onChangeConfig(config);
                                              }}
                                />
                            </Modal.Content>
                        </Modal>
                    </Menu.Item>
                    <Menu.Item>
                        <Trashbox/>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Item name='logout' onClick={this.props.onLogout}/>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

import '../../package';

import * as _ from 'lodash';
import * as React from 'react';
import {Component} from 'react';
import {Button, Checkbox, Dropdown, Header, Icon, Input, Menu, Modal, SemanticWIDTHS} from 'semantic-ui-react';
import CommonConfig from '../models/CommonConfig';
import ConfigEditor from './ConfigEditor';
import Project from '../models/Project';
import Label from '../models/Label';
import {DragDropContext} from 'react-dnd';

import {version} from '../../package.json';
import CardAppearance from '../constants/CardAppearance';
import UiConfig from '../models/UiConfig';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';


export interface NavigationMenuProps {
    projects: Project[];
    labels: Label[];

    config: CommonConfig;
    uiConfig: UiConfig;

    onReload: () => void;
    onChangeConfig: (config: CommonConfig) => void;
    onChangeUiConfig: (config: UiConfig) => void;
}

export interface NavigationMenuState {
    isModalOpen: boolean;
}

export default class extends Component<NavigationMenuProps, NavigationMenuState> {
    state: NavigationMenuState = {isModalOpen: false};
    handleOpen = () => this.setState({isModalOpen: true});
    handleClose = () => this.setState({isModalOpen: false});

    render() {
        return (
            <Menu stackable inverted fixed="top">
                <Menu.Item>
                    <img src='https://github.com/tadashi-aikawa/owlora/raw/master/owlora.png'/>
                </Menu.Item>
                <Menu.Item>
                    <h2>Owlora</h2>
                </Menu.Item>
                <Menu.Item size="mini">
                    version {version}
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item>
                        <span style={{fontColor: "white", marginRight: 5}}>Icebox</span>
                        <Checkbox checked={this.props.uiConfig.isIceboxVisible}
                                  onChange={() => this.props.onChangeUiConfig(
                                      Object.assign({}, this.props.uiConfig, {isIceboxVisible: !this.props.uiConfig.isIceboxVisible})
                                  )}
                                  toggle/>
                    </Menu.Item>
                    <Menu.Item>
                        <Button.Group>
                            <Button toggle
                                    active={this.props.uiConfig.cardAppearance === CardAppearance.OVERVIEW}
                                    onClick={() => this.props.onChangeUiConfig(
                                        Object.assign({}, this.props.uiConfig, {cardAppearance: CardAppearance.OVERVIEW})
                                    )}>
                                Overview
                            </Button>
                            <Button.Or/>
                            <Button toggle
                                    active={this.props.uiConfig.cardAppearance === CardAppearance.DETAIL}
                                    onClick={() => this.props.onChangeUiConfig(
                                        Object.assign({}, this.props.uiConfig, {cardAppearance: CardAppearance.DETAIL})
                                    )}>
                                Detail
                            </Button>
                        </Button.Group>
                    </Menu.Item>
                    <Menu.Item>
                        <Button icon={Order.iconNames[this.props.uiConfig.taskOrder]}
                                onClick={() => this.props.onChangeUiConfig(
                                    Object.assign({}, this.props.uiConfig, {taskOrder: Order.inverses[this.props.uiConfig.taskOrder]})
                                )}
                                labelPosition='left'
                                content={
                                    <Dropdown search
                                              text={this.props.uiConfig.taskSortField}
                                              onChange={(e, {value}: { value: TaskSortField }) => this.props.onChangeUiConfig(
                                                  Object.assign({}, this.props.uiConfig, {taskSortField: value})
                                              )}
                                              options={
                                                  _.map(TaskSortField.toObject, v => ({key: v, text: v, value: v}))
                                              }/>
                                }/>
                    </Menu.Item>
                    <Menu.Item>
                        <Input type='number' min={1} max={5}
                               label={{basic: true, content: 'col'}}
                               labelPosition='right'
                               value={this.props.uiConfig.numberOfCardsPerRow}
                               onChange={(e, data) => this.props.onChangeUiConfig(
                                   Object.assign({}, this.props.uiConfig, {numberOfCardsPerRow: data.value as SemanticWIDTHS})
                               )}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Button accessKey="r" icon="refresh" inverted onClick={e => {
                            e.preventDefault();
                            this.props.onReload();
                        }}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Modal open={this.state.isModalOpen} onClose={this.handleClose} trigger={
                            <Button accessKey="s" icon inverted onClick={this.handleOpen}>
                                <Icon name="setting" size="large"/>
                            </Button>
                        }>
                            <Header icon="setting" content="Settings"/>
                            <Modal.Content>
                                <ConfigEditor defaultConfig={this.props.config}
                                              projects={this.props.projects}
                                              labels={this.props.labels}
                                              onSaveConfig={(config) => {
                                                  this.props.onChangeConfig(config);
                                                  this.handleClose();
                                                  this.props.onReload();
                                              }}
                                />
                            </Modal.Content>
                        </Modal>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

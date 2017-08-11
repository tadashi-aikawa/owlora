import '../../package';

import * as _ from 'lodash';
import * as React from 'react';
import {Component} from 'react';
import {Button, Checkbox, Dropdown, Header, Icon, Menu, Modal, Popup, SemanticWIDTHS} from 'semantic-ui-react';
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
import DayAppearance from "../constants/DayAppearance";


const isMobile = () => {
    return window.innerWidth < 1200;
};

const IceboxToggle = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <span style={{fontColor: "white", marginRight: 5}}>Icebox</span>
        <Checkbox checked={uiConfig.isIceboxVisible}
                  onChange={() => onChangeUiConfig(
                      Object.assign({}, uiConfig, {isIceboxVisible: !uiConfig.isIceboxVisible})
                  )}
                  toggle/>
    </Menu.Item>;

const AppearanceToggle = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <Button.Group>
            <Button toggle
                    active={uiConfig.cardAppearance === CardAppearance.OVERVIEW}
                    onClick={() => onChangeUiConfig(
                        Object.assign({}, uiConfig, {cardAppearance: CardAppearance.OVERVIEW})
                    )}>
                Overview
            </Button>
            <Button.Or/>
            <Button toggle
                    active={uiConfig.cardAppearance === CardAppearance.DETAIL}
                    onClick={() => onChangeUiConfig(
                        Object.assign({}, uiConfig, {cardAppearance: CardAppearance.DETAIL})
                    )}>
                Detail
            </Button>
        </Button.Group>
    </Menu.Item>;

const DayAppearanceToggle = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <Button.Group>
            <Button toggle
                    active={uiConfig.dayAppearance === DayAppearance.WEEKDAY}
                    onClick={() => onChangeUiConfig(
                        Object.assign({}, uiConfig, {dayAppearance: DayAppearance.WEEKDAY})
                    )}>
                Weekday
            </Button>
            <Button.Or/>
            <Button toggle
                    active={uiConfig.dayAppearance === DayAppearance.ALL_DAY}
                    onClick={() => onChangeUiConfig(
                        Object.assign({}, uiConfig, {dayAppearance: DayAppearance.ALL_DAY})
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
                labelPosition='left'
                content={
                    <Dropdown search
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
                              }/>
                }/>
    </Menu.Item>;

const CardColumnsNumSelector = ({uiConfig, onChangeUiConfig}) =>
    <Menu.Item>
        <Dropdown text={uiConfig.numberOfCardsPerRow as string}
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
        <Dropdown text={uiConfig.numberOfCards as string}
                  search labeled button floating compact
                  className="icon" icon="calendar"
                  onChange={(e, {value}: { value: string }) => onChangeUiConfig(
                      Object.assign({}, uiConfig, {numberOfCards: Number(value)})
                  )}
                  options={
                      _.map(_.range(1, 180+1), v => ({
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
                <Menu.Menu position="right">
                    {
                        isMobile() ?
                            <Menu.Item position="right">
                                <Popup inverted
                                       trigger={<Button content="More..." icon="dropdown" inverted/>}
                                       content={
                                           <Menu.Menu style={{
                                               display: "flex",
                                               flexDirection: "column",
                                               justifyContent: "space-around",
                                               height: 250
                                           }}>
                                               <IceboxToggle uiConfig={this.props.uiConfig}
                                                             onChangeUiConfig={this.props.onChangeUiConfig}/>
                                               <AppearanceToggle uiConfig={this.props.uiConfig}
                                                                 onChangeUiConfig={this.props.onChangeUiConfig}/>
                                               <DayAppearanceToggle uiConfig={this.props.uiConfig}
                                                                    onChangeUiConfig={this.props.onChangeUiConfig}/>
                                               <SortOrderSelector uiConfig={this.props.uiConfig}
                                                                  onChangeUiConfig={this.props.onChangeUiConfig}/>
                                               <CardColumnsNumSelector uiConfig={this.props.uiConfig}
                                                                       onChangeUiConfig={this.props.onChangeUiConfig}/>
                                               <CardNumSelector uiConfig={this.props.uiConfig}
                                                                onChangeUiConfig={this.props.onChangeUiConfig}/>
                                           </Menu.Menu>
                                       }
                                       on='click'
                                       position='top right'
                                />
                            </Menu.Item>
                            :
                            <Menu.Menu position="right">
                                <IceboxToggle uiConfig={this.props.uiConfig}
                                              onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <AppearanceToggle uiConfig={this.props.uiConfig}
                                                  onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <DayAppearanceToggle uiConfig={this.props.uiConfig}
                                                     onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <SortOrderSelector uiConfig={this.props.uiConfig}
                                                   onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <CardColumnsNumSelector uiConfig={this.props.uiConfig}
                                                        onChangeUiConfig={this.props.onChangeUiConfig}/>
                                <CardNumSelector uiConfig={this.props.uiConfig}
                                                 onChangeUiConfig={this.props.onChangeUiConfig}/>
                            </Menu.Menu>
                    }

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
                            <Header icon="setting" content={`Settings (version ${version})`}/>
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

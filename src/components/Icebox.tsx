import * as React from 'react';
import {Component} from 'react';
import * as _ from 'lodash';
import {Card, Dimmer, Divider, Icon, Segment, SemanticCOLORS, Statistic} from 'semantic-ui-react';
import Task, {TaskUpdateParameter} from '../models/Task';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import {DragSource, DropTarget} from 'react-dnd';
import {findDOMNode} from 'react-dom';
import TaskFeeds from "./TaskFeeds";
import Milestone from './Milestone';
import EstimateIconGroup from './EstimateIconGroup';
import Seal from './Seal';
import {Dictionary} from 'lodash';


export interface IceboxProps {
    tasks: Task[];
    taskSortField: TaskSortField;
    taskOrder: Order;
    milestone: boolean;
    seal: boolean;
    iconDisabledMap: Dictionary<boolean>;
    width: number;

    connectDropTarget?: Function;
    isOver?: boolean;
    canDrop?: boolean;

    onUpdateTask: (parameter: TaskUpdateParameter) => void;
}

@DropTarget(
    'task',
    {
        drop(props: IceboxProps, monitor, component) {
            if (monitor.didDrop()) {
                return;
            }

            return {
                date: '',
                dateString: ''
            };
        },

        canDrop(props: IceboxProps, monitor) {
            return !_.includes(props.tasks.map(x => x.id), monitor.getItem().id)
        }
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    })
)
export default class extends Component<IceboxProps> {
    shouldComponentUpdate(nextProps: Readonly<IceboxProps>) {
        // For avoid performance issues
        return !(this.props === nextProps || _.isEqual(
            _.omit(this.props, ['canDrop']),
            _.omit(nextProps, ['canDrop']),
        ))
    }

    render() {
        const estimatedTasks: Task[] = _(this.props.tasks)
            .reject(t => t.isMilestone || t.isSeal)
            .value();

        const onlyEnabled = (x: Task) => !this.props.iconDisabledMap[x.icon];

        return (
            <Card ref={node => this.props.connectDropTarget && this.props.connectDropTarget(findDOMNode(this))}
                  style={{width: this.props.width}}>
                <Dimmer active={!this.props.canDrop && this.props.isOver}
                        style={{backgroundColor: "grey", opacity: 0.5}}
                        content=""/>
                <Dimmer active={this.props.canDrop && this.props.isOver}
                        style={{backgroundColor: "red", opacity: 0.5}}
                        content={
                            <div>
                                <h2>Remove duedate</h2>
                                <Icon name='arrow circle outline down' size='huge'/>
                            </div>
                        }/>
                <Segment inverted style={{margin: 0}}>
                    <Icon name="inbox" size="big" color="teal"/>
                    <Statistic size='mini' color="teal" inverted>
                        <Statistic.Value>ICEBOX</Statistic.Value>
                    </Statistic>
                </Segment>
                <Card.Content>
                    {
                        this.props.seal &&
                        this.props.tasks.filter(t => t.isSeal)
                            .map(t => <Seal key={t.id}
                                            id={t.id}
                                            name={t.name}
                                            color={t.color as SemanticCOLORS}
                                            date={t.dueDate}
                                            onUpdate={this.props.onUpdateTask}
                            />)
                    }
                    {
                        this.props.milestone && this.props.tasks.filter(t => t.isMilestone).filter(onlyEnabled)
                            .map(t => <Milestone key={t.id}
                                                 id={t.id}
                                                 name={t.name}
                                                 color={t.color as SemanticCOLORS}
                                                 size={t.size}
                                                 date={t.dueDate}
                                                 onUpdate={this.props.onUpdateTask}
                            />)
                    }
                    <Divider horizontal>{estimatedTasks.filter(onlyEnabled).length} Tasks</Divider>
                    <TaskFeeds tasks={estimatedTasks.filter(onlyEnabled)}
                               taskSortField={this.props.taskSortField}
                               taskOrder={this.props.taskOrder}
                               onUpdateTask={this.props.onUpdateTask}/>
                </Card.Content>
                <Card.Content extra>
                    <EstimateIconGroup tasks={estimatedTasks}
                                       taskSortFieldInPopup={this.props.taskSortField}
                                       taskOrderInPopup={this.props.taskOrder}
                                       iconDisabledMap={this.props.iconDisabledMap}
                                       onUpdateTask={this.props.onUpdateTask}/>
                </Card.Content>
            </Card>
        );
    }
};

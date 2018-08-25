import * as React from "react";
import { Component } from "react";
import * as _ from "lodash";
import { Card, Dimmer, Divider, Icon, Segment, SemanticCOLORS, Statistic } from "semantic-ui-react";
import Task, { TaskUpdateParameter } from "../models/Task";
import TaskSortField from "../constants/TaskSortField";
import Order from "../constants/Order";
import { DragSource, DropTarget } from "react-dnd";
import { findDOMNode } from "react-dom";
import TaskFeeds from "./TaskFeeds";
import Milestone from "./Milestone";
import EstimateIconGroup from "./EstimateIconGroup";
import Seal from "./Seal";
import Filter, { createApplier } from "../models/Filter";

export interface IceboxProps {
    tasks: Task[];
    taskSortField: TaskSortField;
    taskOrder: Order;
    milestone: boolean;
    seal: boolean;
    filter?: Filter;
    width: number;

    connectDropTarget?: Function;
    isOver?: boolean;
    canDrop?: boolean;

    onUpdateTask: (parameter: TaskUpdateParameter) => void;
    onRemoveTask: (id: number) => void;
}

@DropTarget(
    ["task", "seal", "milestone"],
    {
        drop(props: IceboxProps, monitor, component) {
            if (monitor.didDrop()) {
                return;
            }

            return {
                type: "update",
                date: "",
                dateString: "",
            };
        },

        canDrop(props: IceboxProps, monitor) {
            return !_.includes(props.tasks.map(x => x.id), monitor.getItem().id);
        },
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
        return !(
            this.props === nextProps || _.isEqual(_.omit(this.props, ["canDrop"]), _.omit(nextProps, ["canDrop"]))
        );
    }

    render() {
        const estimatedTasks: Task[] = _(this.props.tasks)
            .reject(t => t.estimatedMinutes === undefined)
            .value();

        const applyFilter = createApplier(this.props.filter);

        return (
            <Card
                ref={node => this.props.connectDropTarget && this.props.connectDropTarget(findDOMNode(this))}
                style={{ width: this.props.width }}
            >
                <Dimmer
                    active={!this.props.canDrop && this.props.isOver}
                    style={{ backgroundColor: "grey", opacity: 0.5 }}
                    content=""
                />
                <Dimmer
                    active={this.props.canDrop && this.props.isOver}
                    style={{ backgroundColor: "red", opacity: 0.5 }}
                    content={
                        <div>
                            <h2>Remove duedate</h2>
                            <Icon name="arrow alternate circle down outline" size="huge" />
                        </div>
                    }
                />
                <Segment inverted style={{ margin: 0 }}>
                    <Icon name="inbox" size="big" color="teal" />
                    <Statistic size="mini" color="teal" inverted>
                        <Statistic.Value>ICEBOX</Statistic.Value>
                    </Statistic>
                </Segment>
                <Card.Content>
                    {this.props.seal &&
                        this.props.tasks
                            .filter(t => t.isSeal)
                            .filter(applyFilter)
                            .map(t => (
                                <Seal
                                    key={t.id}
                                    id={t.id}
                                    name={t.name}
                                    color={t.sealColor as SemanticCOLORS}
                                    date={t.dueDate}
                                    onUpdate={this.props.onUpdateTask}
                                    onRemove={this.props.onRemoveTask}
                                />
                            ))}
                    {this.props.milestone &&
                        this.props.tasks
                            .filter(t => t.isMilestone)
                            .filter(applyFilter)
                            .map(t => (
                                <Milestone
                                    key={t.id}
                                    id={t.id}
                                    name={t.name}
                                    color={t.milestoneColor as SemanticCOLORS}
                                    size={t.size}
                                    date={t.dueDate}
                                    onUpdate={this.props.onUpdateTask}
                                    onRemove={this.props.onRemoveTask}
                                />
                            ))}
                    <Divider horizontal>{estimatedTasks.filter(applyFilter).length} Tasks</Divider>
                    <TaskFeeds
                        tasks={estimatedTasks.filter(applyFilter)}
                        taskSortField={this.props.taskSortField}
                        taskOrder={this.props.taskOrder}
                        onUpdateTask={this.props.onUpdateTask}
                        onRemoveTask={this.props.onRemoveTask}
                    />
                </Card.Content>
                <Card.Content extra>
                    <EstimateIconGroup
                        tasks={estimatedTasks.filter(applyFilter)}
                        taskSortFieldInPopup={this.props.taskSortField}
                        taskOrderInPopup={this.props.taskOrder}
                        onUpdateTask={this.props.onUpdateTask}
                        onRemoveTask={this.props.onRemoveTask}
                    />
                </Card.Content>
            </Card>
        );
    }
}

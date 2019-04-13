import * as React from "react";
import {Component} from "react";
import {Feed, Label} from "semantic-ui-react";
import Task, {TaskUpdateParameter} from "../models/Task";
import {findDOMNode} from "react-dom";
import ImageOrEmoji from "./ImageOrEmoji";
import Emojify from "react-emojione";
import {DragSource, DropTarget} from "react-dnd";
import EditorIcon from "./EditIcon";
import {DEFAULT_TASK_COLOR} from "../storage/settings";

export interface TaskFeedState {
    hiddenEditIcon: boolean;
}

interface TaskFeedProps {
    task: Task;

    connectDragSource?: Function;
    isDragging?: boolean;

    onUpdate: (parameter: TaskUpdateParameter) => void;
    onRemove: (id: number) => void;
}

@DragSource(
    "task",
    {
        beginDrag(props: TaskFeedProps) {
            return {
                id: props.task.id,
                name: props.task.name,
                projectName: props.task.projectName,
                color: props.task.color,
                size: props.task.size,
                icon: props.task.icon,
                estimatedMinutes: props.task.estimatedMinutes,
                date: props.task.dueDate,
            };
        },

        endDrag(props: TaskFeedProps, monitor) {
            if (!monitor.didDrop()) {
                return;
            }

            switch (monitor.getDropResult().type) {
                case "update":
                    props.onUpdate({
                        id: props.task.id,
                        name: props.task.name,
                        dueDate: monitor.getDropResult().date,
                        dateString: monitor.getDropResult().dateString,
                    });
                    break;
                case "remove":
                    props.onRemove(props.task.id);
                    break;
                default:
                    // TODO
                    console.error('Unexpected error.')
            }
        },
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })
)
export default class extends Component<TaskFeedProps, TaskFeedState> {
    state: TaskFeedState = {
        hiddenEditIcon: true,
    };

    render() {
        const {name, projectName, icon, estimatedMinutes, color} = this.props.task;
        return (
            <div ref={node => this.props.connectDragSource && this.props.connectDragSource(findDOMNode(this))}>
                <Feed>
                    <Feed.Event
                        onMouseEnter={() => this.setState({hiddenEditIcon: false})}
                        onMouseLeave={() => this.setState({hiddenEditIcon: true})}
                        style={{
                            backgroundColor: color || DEFAULT_TASK_COLOR,
                            border: "2px solid",
                            borderRadius: "20px",
                            borderColor: color || DEFAULT_TASK_COLOR,
                            padding: "10px",
                            marginTop: "10px",
                            marginBottom: "10px",
                            cursor: "move",
                            opacity: this.props.isDragging ? 0.1 : 1,
                        }}
                    >
                        <Feed.Label>
                            <ImageOrEmoji src={icon}/>
                        </Feed.Label>
                        <Feed.Content>
                            <Feed.Date content={<Emojify style={{height: 20, width: 20}}>{projectName}</Emojify>}/>
                            <Feed.Summary>
                                <Emojify style={{height: 20, width: 20, marginLeft: 10}}>{name}</Emojify>
                                <EditorIcon id={this.props.task.id} hidden={this.state.hiddenEditIcon}/>
                            </Feed.Summary>
                        </Feed.Content>
                        <Label
                            color={estimatedMinutes ? "teal" : "violet"}
                            circular
                            size="large"
                            style={{
                                margin: "auto",
                                width: "auto",
                                textAlign: "center",
                                marginLeft: 5,
                            }}
                        >
                            {estimatedMinutes || "???"}
                        </Label>
                    </Feed.Event>
                </Feed>
            </div>
        );
    }
}

import * as React from 'react';
import {Component} from 'react';
import {Feed, Label} from 'semantic-ui-react';
import Task, {TaskUpdateParameter} from '../models/Task';
import {findDOMNode} from 'react-dom';
import ImageOrEmoji from './ImageOrEmoji';
import Emojify from 'react-emojione';
import {DragSource, DropTarget} from 'react-dnd';

interface TaskFeedProps {
    task: Task;

    connectDragSource?: Function;
    isDragging?: boolean;

    onUpdate: (parameter: TaskUpdateParameter) => void;
}

@DragSource(
    'task',
    {
        beginDrag(props: TaskFeedProps) {
            return {
                date: props.task.dueDate,
            };
        },

        endDrag(props: TaskFeedProps, monitor) {
            if (!monitor.didDrop()) {
                return;
            }

            props.onUpdate({
                id: props.task.id,
                name: props.task.name,
                dueDate: monitor.getDropResult().date,
                dateString: monitor.getDropResult().dateString
            });
        }
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)
export default class extends Component<TaskFeedProps> {

    render() {
        const {name, projectName, icon, estimatedMinutes, color} = this.props.task;
        return (
            <Feed.Event ref={node => this.props.connectDragSource(findDOMNode(this))} style={{
                backgroundColor: color,
                border: '2px solid',
                borderRadius: '20px',
                borderColor: color,
                padding: '10px',
                marginTop: '10px',
                marginBottom: '10px',
                cursor: 'move',
                opacity: this.props.isDragging ? 0.1 : 1
            }}>
                <Feed.Label>
                    <ImageOrEmoji src={icon}/>
                </Feed.Label>
                <Feed.Content>
                    <Feed.Date content={<Emojify style={{height: 20, width: 20}}>{projectName}</Emojify>}/>
                    <Feed.Summary>
                        <Emojify style={{height: 20, width: 20, marginLeft: 10}}>{name}</Emojify>
                    </Feed.Summary>
                </Feed.Content>
                <Label color='teal' circular size="large"
                       style={{
                           margin: 'auto',
                           width: 'auto',
                           textAlign: 'center',
                           marginLeft: 5
                       }}>{estimatedMinutes}</Label>
            </Feed.Event>
        );
    }
}

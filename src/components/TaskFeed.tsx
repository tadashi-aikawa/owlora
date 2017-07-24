import * as React from 'react';
import {Component} from 'react';
import {Feed, Label} from 'semantic-ui-react';
import Emojify from 'react-emojione';
import {DragSource} from 'react-dnd';
import {findDOMNode} from 'react-dom';
import {default as Task, TaskUpdateParameter} from '../models/Task';
import ImageOrEmoji from './ImageOrEmoji';

export interface TaskFeedProps {
    task: Task;

    connectDragSource?: Function;
    isDragging?: boolean;

    onUpdate: (parameter: TaskUpdateParameter) => void;
}

@DragSource(
    'task-feed',
    {
        beginDrag(props: TaskFeedProps) {
            return {
                id: props.task.id,
                name: props.task.name
            };
        },

        endDrag(props: TaskFeedProps, monitor, component) {
            if (!monitor.didDrop()) {
                return;
            }

            props.onUpdate({
                id: props.task.id,
                name: props.task.name,
                dueDate: monitor.getDropResult().date
            });
        }
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)
class TaskFeed extends Component<TaskFeedProps> {
    componentDidMount() {
        this.props.connectDragSource(findDOMNode(this));
    }

    render() {
        const {name, projectName, icon, estimatedMinutes, color} = this.props.task;
        return (
            <Feed.Event style={{
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
                <Label color='teal' circular
                       style={{width: 25, height: 20, textAlign: 'center'}}>{estimatedMinutes}</Label>
            </Feed.Event>
        );
    }
}

export default TaskFeed;

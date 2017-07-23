import * as React from 'react';
import {Component} from 'react';
import {Feed, Label} from 'semantic-ui-react';
import Emojify from 'react-emojione';
import {DragSource} from 'react-dnd';
import {findDOMNode} from 'react-dom';
import {TaskUpdateParameter} from '../models/Task';

const isEmoji = v => v && v.match(/^:[^:]+:$/);

export interface TaskFeedProps {
    id: number;
    name: string;
    project: string;
    icon: string;
    estimatedMinutes: number;

    connectDragSource?: Function;
    isDragging?: boolean;

    onUpdate: (parameter: TaskUpdateParameter) => void;
}

@DragSource(
    'task-feed',
    {
        beginDrag(props) {
            return {
                id: props.id,
                name: props.name
            };
        },

        endDrag(props, monitor, component) {
            if (!monitor.didDrop()) {
                return;
            }

            props.onUpdate({
                id: props.id,
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
        return (
            <Feed.Event style={{opacity: this.props.isDragging ? 0.1 : 1}}>
                <Feed.Label>
                    {isEmoji(this.props.icon) ? <Emojify>{this.props.icon}</Emojify> : <img src={this.props.icon}/>}
                </Feed.Label>
                <Feed.Content>
                    <Feed.Date content={<Emojify style={{height: 20, width: 20}}>{this.props.project}</Emojify>}/>
                    <Feed.Summary>
                        <Emojify style={{height: 20, width: 20, marginLeft: 10}}>{this.props.name}</Emojify>
                    </Feed.Summary>
                </Feed.Content>
                <Label color='teal' circular
                       style={{width: 25, height: 20, textAlign: 'center'}}>{this.props.estimatedMinutes}</Label>
            </Feed.Event>
        );
    }
}

export default TaskFeed;

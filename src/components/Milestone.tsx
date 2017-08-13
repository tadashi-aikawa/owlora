import * as React from 'react';
import {findDOMNode} from 'react-dom';
import {Component} from 'react';
import Emojify from 'react-emojione';
import {Message} from 'semantic-ui-react';
import {Moment, now} from 'moment';
import {TaskUpdateParameter} from '../models/Task';
import {DragSource, DropTarget} from 'react-dnd';


export interface MilestoneProps {
    id: number;
    name: string;
    date: Moment;

    connectDragSource?: Function;
    isDragging?: boolean;

    onUpdate: (parameter: TaskUpdateParameter) => void;
}


@DragSource(
    'task',
    {
        beginDrag(props: MilestoneProps) {
            return {
                date: props.date,
            };
        },

        endDrag(props: MilestoneProps, monitor) {
            if (!monitor.didDrop()) {
                return;
            }

            props.onUpdate({
                id: props.id,
                name: props.name,
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
export default class extends Component<MilestoneProps> {
    render() {
        return (
            <Message color="pink" ref={node => this.props.connectDragSource(findDOMNode(this))} style={{
                cursor: 'move',
                opacity: this.props.isDragging ? 0.1 : 1
            }}>
                <Message.Content>
                    <Message.Header><Emojify>{this.props.name}</Emojify></Message.Header>
                </Message.Content>
            </Message>
        );
    }
};

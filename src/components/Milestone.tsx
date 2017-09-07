import * as React from 'react';
import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import Emojify from 'react-emojione';
import {Message, SemanticCOLORS} from 'semantic-ui-react';
import {Moment} from 'moment';
import {TaskUpdateParameter} from '../models/Task';
import {DragSource, DropTarget} from 'react-dnd';
import Size from '../constants/Size';
import EditorIcon from './EditIcon';

export interface MilestoneState {
    hiddenEditIcon: boolean
}

export interface MilestoneProps {
    id: number;
    name: string;
    date: Moment;
    color: SemanticCOLORS;
    size: Size;

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
export default class extends Component<MilestoneProps, MilestoneState> {
    state: MilestoneState = {
        hiddenEditIcon: true
    };

    render() {
        return (
            <Message color={this.props.color}
                     size={this.props.size}
                     ref={node => this.props.connectDragSource && this.props.connectDragSource(findDOMNode(this))}
                     style={{
                         cursor: 'move',
                         opacity: this.props.isDragging ? 0.1 : 1
                     }}
                     onMouseEnter={() => this.setState({hiddenEditIcon: false})}
                     onMouseLeave={() => this.setState({hiddenEditIcon: true})}
            >
                <Message.Content>
                    <Message.Header>
                        <Emojify style={{
                            width: Size.toEmojiSize[this.props.size],
                            height: Size.toEmojiSize[this.props.size]
                        }}>
                            {this.props.name}
                        </Emojify>
                        <EditorIcon id={this.props.id} hidden={this.state.hiddenEditIcon}/>
                    </Message.Header>
                </Message.Content>
            </Message>
        );
    }
};

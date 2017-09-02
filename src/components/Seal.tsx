import * as React from 'react';
import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import Emojify from 'react-emojione';
import {Label, SemanticCOLORS} from 'semantic-ui-react';
import {Moment} from 'moment';
import {TaskUpdateParameter} from '../models/Task';
import {DragSource, DropTarget} from 'react-dnd';
import EditorIcon from './EditIcon';

export interface SealProps {
    id: number;
    name: string;
    date: Moment;
    color: SemanticCOLORS;

    connectDragSource?: Function;
    isDragging?: boolean;

    onUpdate: (parameter: TaskUpdateParameter) => void;
}


@DragSource(
    'task',
    {
        beginDrag(props: SealProps) {
            return {
                date: props.date,
            };
        },

        endDrag(props: SealProps, monitor) {
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
export default class extends Component<SealProps> {
    render() {
        return (
            <Label color={this.props.color}
                   basic
                   ref={node => this.props.connectDragSource(findDOMNode(this))}
                   style={{
                       cursor: 'move',
                       opacity: this.props.isDragging ? 0.1 : 1
                   }}>
                <Emojify style={{
                    width: 16,
                    height: 16,
                }}>
                    {this.props.name}
                </Emojify>
                <EditorIcon id={this.props.id} margin={3}/>
            </Label>
        );
    }
};

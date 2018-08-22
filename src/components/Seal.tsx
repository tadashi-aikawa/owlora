import * as React from 'react';
import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import Emojify from 'react-emojione';
import {Message, SemanticCOLORS} from 'semantic-ui-react';
import {Moment} from 'moment';
import {TaskUpdateParameter} from '../models/Task';
import {DragSource, DropTarget} from 'react-dnd';
import EditorIcon from './EditIcon';
import {style} from "typestyle";

export interface SealState {
    hiddenEditIcon: boolean
}

export interface SealProps {
    id: number;
    name: string;
    date?: Moment;
    color: SemanticCOLORS;

    connectDragSource?: Function;
    isDragging?: boolean;

    onUpdate: (parameter: TaskUpdateParameter) => void;
    onRemove: (id: number) => void;
}

@DragSource(
    'seal',
    {
        beginDrag(props: SealProps) {
            return {
                id: props.id,
                name: props.name,
                color: props.color,
                date: props.date,
            };
        },

        endDrag(props: SealProps, monitor) {
            if (!monitor.didDrop()) {
                return;
            }

            switch (monitor.getDropResult().type) {
                case "update":
                    props.onUpdate({
                        id: props.id,
                        name: props.name,
                        dueDate: monitor.getDropResult().date,
                        dateString: monitor.getDropResult().dateString,
                    });
                    break;
                case "remove":
                    props.onRemove(props.id);
                    break;
                default:
                    // TODO
                    console.error('Unexpected error.')
            }
        }
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)
export default class extends Component<SealProps, SealState> {
    state: SealState = {
        hiddenEditIcon: true
    };

    render() {
        return (
            <Message color={this.props.color}
                     compact
                     size="mini"
                     ref={node => this.props.connectDragSource && this.props.connectDragSource(findDOMNode(this))}
                     style={{
                         cursor: 'move',
                         opacity: this.props.isDragging ? 0.1 : 1,
                         padding: '10px',
                         fontSize: '75%',
                         margin: 0,
                     }}
                     onMouseEnter={() => this.setState({hiddenEditIcon: false})}
                     onMouseLeave={() => this.setState({hiddenEditIcon: true})}
            >
                <Message.Content>
                    <Message.Header>
                        <Emojify style={{
                            width: 16,
                            height: 16,
                        }}>
                            {this.props.name}
                        </Emojify>
                        <EditorIcon id={this.props.id} hidden={this.state.hiddenEditIcon} margin={3}/>
                    </Message.Header>
                </Message.Content>
            </Message>
        );
    }
};

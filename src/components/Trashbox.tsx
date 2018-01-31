import * as React from "react";
import {Component} from "react";
import {Dimmer, Icon, Segment} from "semantic-ui-react";
import {DragSource, DropTarget} from "react-dnd";
import {findDOMNode} from "react-dom";

export interface TrashboxProps {
    connectDropTarget?: Function;
    isOver?: boolean;
    canDrop?: boolean;
}

@DropTarget(
    ["task", "seal", "milestone"],
    {
        drop(props: TrashboxProps, monitor, component) {
            if (monitor.didDrop()) {
                return;
            }

            return {
                type: "remove",
            };
        },

        canDrop(props: TrashboxProps, monitor) {
            return true;
        },
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    })
)
export default class extends Component<TrashboxProps> {

    render() {
        return (
            <div ref={node => this.props.connectDropTarget && this.props.connectDropTarget(findDOMNode(this))}
                 style={{width: 60, height: 50}}>
                <Dimmer active={!this.props.canDrop && this.props.isOver}
                        style={{backgroundColor: "grey", opacity: 0.5}}
                        content=""/>
                <Dimmer active={this.props.canDrop && this.props.isOver}
                        style={{backgroundColor: "violet", opacity: 0.5}}
                        content={
                            <div>
                                <h2>Remove forever!!!</h2>
                                <Icon name='arrow circle outline down' size='huge'/>
                            </div>
                        }/>
                <Icon size='big' name='trash' color='red'/>
            </div>
        )
    }
}

import * as React from 'react';
import {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class DnDWrapper extends Component<any, any> {
    render() {
        return <div>{this.props.children}</div>;
    }
}

export default DnDWrapper;

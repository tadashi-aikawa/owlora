import * as React from 'react';
import {Icon} from 'semantic-ui-react';

export interface EditorIconProps {
    id: number;
    margin?: number
}

const EditorIcon = (props: EditorIconProps) =>
    <a href={`https://todoist.com/app?#task%2F${props.id}`}
       target="blank"
       style={{marginLeft: props.margin || 8}}>
        <Icon link name="edit"/>
    </a>;

export default EditorIcon;




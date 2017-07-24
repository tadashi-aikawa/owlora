import * as React from 'react';
import Emojify from 'react-emojione';
import {DragSource} from 'react-dnd';
import {Image} from 'semantic-ui-react';

const isEmoji = v => v && v.match(/^:[^:]+:$/);

export interface ImageOrEmojiProps {
    src: string;
}

const ImageOrEmoji = (props: ImageOrEmojiProps) =>
    isEmoji(props.src) ? <Emojify>{props.src}</Emojify> : <Image src={props.src} avatar/>;

export default ImageOrEmoji;

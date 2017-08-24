import * as React from 'react';
import {Icon, Segment, Label, Header, Image} from 'semantic-ui-react';
import {version} from '../../../package.json';

const LOGO = require('../../../owlora.png');

const ConfigInfo = ({version: string}) =>
    <Segment padded>
        <Label attached='top right' size="big">
            <a href="https://github.com/tadashi-aikawa/owlora">
                <Icon name="github"/> Go to GitHub
            </a>
        </Label>
        <Image centered src={LOGO}/>
        <Header as='h2' textAlign='center'>
            <Header.Content>
                {`Owlora version ${version}`}
            </Header.Content>
        </Header>
    </Segment>;

export default ConfigInfo;

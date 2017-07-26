import { configure } from '@storybook/react';
import '../node_modules/semantic-ui-css/semantic.min.css';

const req = require.context('../src/components', true, /\.stories\.tsx$/);

function loadStories() {
    req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);

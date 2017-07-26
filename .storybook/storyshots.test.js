import initStoryshots from '@storybook/addon-storyshots';

// Reason why using mock is https://github.com/facebook/react/issues/7371
jest.mock('react-dom');
(import('react-dom') as any).findDOMNode = jest.fn();

initStoryshots();

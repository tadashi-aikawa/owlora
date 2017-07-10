import '../node_modules/semantic-ui-css/semantic.min.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import TasksConteiner from './containers/TasksContainer';

import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga'
import root from './sagas'
import owloraApp from './reducers';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(owloraApp, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(root);

ReactDOM.render(
    <Provider store={store}>
        <TasksConteiner />
    </Provider>,
    document.getElementById("example")
);

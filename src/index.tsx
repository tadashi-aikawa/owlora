import '../node_modules/semantic-ui-css/semantic.min.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import TasksConteiner from './containers/TasksContainer';

import {applyMiddleware, createStore, compose} from 'redux';
import createSagaMiddleware from 'redux-saga'
import root from './sagas'
import owloraApp from './reducers';
import * as persistState from 'redux-localstorage'


const finalCreateStore = compose(persistState('config', {key: 'config'}))(createStore);
const sagaMiddleware = createSagaMiddleware();
const store = finalCreateStore(owloraApp, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(root);

ReactDOM.render(
    <Provider store={store}>
        <TasksConteiner />
    </Provider>,
    document.getElementById("root")
);

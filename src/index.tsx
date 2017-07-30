import '../node_modules/semantic-ui-css/semantic.min.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import TopContainer from './containers/TopContainer';

import {applyMiddleware, createStore, compose} from 'redux';
import createSagaMiddleware from 'redux-saga'
import root from './sagas'
import owloraApp, {INITIAL_CONFIG_STATE, INITIAL_ROOT_STATE} from './reducers';
import * as persistState from 'redux-localstorage'
import {ConfigState} from './states/ConfigState';
import RootState from './states/index';

// Super hack!!
const config = {
    key: 'config',
    deserialize: (stateStr): RootState => {
        const state: RootState = JSON.parse(stateStr);
        if (!state) {
            return INITIAL_ROOT_STATE;
        }

        const configState: ConfigState = JSON.parse(stateStr).config;
        Object.keys(INITIAL_CONFIG_STATE).forEach((key) => {
            configState[key] = Object.assign({}, INITIAL_CONFIG_STATE[key], configState[key]);
        });

        return Object.assign(state, {config: configState});
    }
};

const finalCreateStore = compose(persistState('config', config))(createStore);
const sagaMiddleware = createSagaMiddleware();
const store = finalCreateStore(owloraApp, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(root);

ReactDOM.render(
    <Provider store={store}>
        <TopContainer />
    </Provider>,
    document.getElementById("root")
);

import '../node_modules/semantic-ui-css/semantic.min.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import TopContainer from './containers/TopContainer';

import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga'
import root from './sagas'
import owloraApp, {INITIAL_ROOT_STATE, INITIAL_STORAGE_STATE} from './reducers';
import {getFirebase, reactReduxFirebase} from 'react-redux-firebase';
import * as persistState from 'redux-localstorage'
import RootState from './states/index';
import {StorageState} from './states/StorageState';

const firebaseConfig = {
    apiKey: 'AIzaSyDogXq52bKDV2vhbyLd-UtnUV0DnZ_6RH0',
    authDomain: 'owlora-mamansoft.firebaseapp.com',
    databaseURL: 'https://owlora-mamansoft.firebaseio.com',
    storageBucket: 'owlora-mamansoft.appspot.com',
};

const config = {
    userProfile: 'users',
    enableLogging: false,
};

const storage = {
    key: 'storage',
    deserialize: (stateStr): RootState => {
        const state: RootState = JSON.parse(stateStr);
        if (!state) {
            return INITIAL_ROOT_STATE;
        }

        const storageState: StorageState = JSON.parse(stateStr).storage;
        Object.keys(INITIAL_STORAGE_STATE).forEach((key) => {
            storageState[key] = Object.assign({}, INITIAL_STORAGE_STATE[key], storageState[key]);
        });

        return Object.assign(state, {storage: storageState});
    }
};

const createStoreWithFirebase = compose(reactReduxFirebase(firebaseConfig, config))(createStore);
const createFinalStore = compose(persistState('storage', storage))(createStoreWithFirebase);
const sagaMiddleware = createSagaMiddleware();
const store = createFinalStore(owloraApp, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(root);

ReactDOM.render(
    <Provider store={store}>
        <TopContainer/>
    </Provider>,
    document.getElementById("root")
);

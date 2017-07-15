import {combineReducers, Reducer} from 'redux';
import {Actions, FETCH_TASKS, SUCCESS_FETCH_TASKS, UPDATE_ESTIMATED_LABELS, UPDATE_TODOIST_API_TOKEN} from '../actions';
import {AppState} from '../states/AppState';
import {ConfigState} from '../states/ConfigState';

const INITIAL_APP_STATE: AppState = {
    tasks: [],
    isTaskLoading: false,
};

const INITIAL_CONFIG_STATE: ConfigState = {
    todoistToken: '',
    estimatedLabels: {}
};

const appState = (state: AppState = INITIAL_APP_STATE, action: Actions): AppState => {
    switch (action.type) {
        case FETCH_TASKS:
            return Object.assign({}, state, {isTaskLoading: true});
        case SUCCESS_FETCH_TASKS:
            return Object.assign({}, state, {tasks: action.tasks, isTaskLoading: false});
        default:
            return state;
    }
};

const configState = (state: ConfigState = INITIAL_CONFIG_STATE, action: Actions): ConfigState => {
    switch (action.type) {
        case UPDATE_TODOIST_API_TOKEN:
            return Object.assign({}, state, {todoistToken: action.apiToken});
        case UPDATE_ESTIMATED_LABELS:
            return Object.assign({}, state, {estimatedLabels: action.estimatedLabels});
        default:
            return state;
    }
};

export default combineReducers({
    app: appState as Reducer<any>,
    config: configState as Reducer<any>,
});

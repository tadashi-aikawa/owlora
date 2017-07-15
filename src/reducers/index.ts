import {combineReducers, Reducer} from 'redux';
import {Actions, FETCH_TASKS, SUCCESS_FETCH_TASKS, UPDATE_ESTIMATED_LABELS, UPDATE_TODOIST_API_TOKEN} from '../actions';
import {AppState} from '../states/AppState';

const INITIAL_APP_STATE: AppState = {
    tasks: [],
    estimatedLabels: {},
    isTaskLoading: false,
    todoistToken: '',
};

const appState = (state: AppState = INITIAL_APP_STATE, action: Actions): AppState => {
    switch (action.type) {
        case FETCH_TASKS:
            return Object.assign({}, state, {isTaskLoading: true});
        case SUCCESS_FETCH_TASKS:
            return Object.assign({}, state, {tasks: action.tasks, isTaskLoading: false});
        case UPDATE_TODOIST_API_TOKEN:
            return Object.assign({}, state, {todoistToken: action.apiToken});
        case UPDATE_ESTIMATED_LABELS:
            return Object.assign({}, state, {estimatedLabels: action.estimatedLabels});
        default:
            return state;
    }
};

export default combineReducers({
    appState: appState as Reducer<any>
});

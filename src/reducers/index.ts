import {combineReducers, Reducer} from 'redux';
import {Actions, FETCH_TASKS, SUCCESS_FETCH_TASKS} from '../actions';
import {AppState} from '../states/AppState';

// TODO: delete
const INITIAL_APP_STATE: AppState = {
    tasks: [],
    isTaskLoading: false,
    todoistToken: 'hoge',
};

const appState = (state: AppState = INITIAL_APP_STATE, action: Actions): AppState => {
    switch (action.type) {
        case FETCH_TASKS:
            return Object.assign({}, state, {
                isTaskLoading: true,
            });
        case SUCCESS_FETCH_TASKS:
            return Object.assign({}, state, {
                tasks: action.tasks,
                isTaskLoading: false,
            });
        default:
            return state;
    }
};

const owloraApp = combineReducers({
    appState: appState as Reducer<any>
});

export default owloraApp

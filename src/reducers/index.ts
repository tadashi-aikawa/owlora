import {combineReducers, Reducer} from 'redux';
import {Actions, FETCH_TASKS, SUCCESS_FETCH_TASKS, UPDATE_COMMON_CONFIG} from '../actions';
import {AppState} from '../states/AppState';
import {ConfigState} from '../states/ConfigState';
import Order from '../constants/Order';
import TaskSortField from '../constants/TaskSortField';

const INITIAL_APP_STATE: AppState = {
    tasks: [],
    isTaskLoading: false,
};

const INITIAL_CONFIG_STATE: ConfigState = {
    common: {
        todoistToken: '',
        minutesToUsePerDay: 240,
        estimatedLabels: {},
        minutesToUsePerSpecificDays: {},
        iconsByProject: {},
        taskSortField: TaskSortField.PROJECT_NAME,
        taskOrder: Order.ASC,
    }
};

const appState = (state: AppState = INITIAL_APP_STATE, action: Actions): AppState => {
    switch (action.type) {
        case FETCH_TASKS:
            return Object.assign({}, state, {isTaskLoading: true});
        case SUCCESS_FETCH_TASKS:
            return Object.assign({}, state, {tasks: action.payload, isTaskLoading: false});
        default:
            return state;
    }
};

const configState = (state: ConfigState = INITIAL_CONFIG_STATE, action: Actions): ConfigState => {
    switch (action.type) {
        case UPDATE_COMMON_CONFIG:
            return Object.assign({}, state, {common: action.payload});
        default:
            return state;
    }
};

export default combineReducers({
    app: appState as Reducer<any>,
    config: configState as Reducer<any>,
});

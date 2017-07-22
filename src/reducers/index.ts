import {combineReducers, Reducer} from 'redux';
import {Actions, SYNC, SUCCESS_SYNC, UPDATE_COMMON_CONFIG} from '../actions';
import {AppState} from '../states/AppState';
import {ConfigState} from '../states/ConfigState';
import Order from '../constants/Order';
import TaskSortField from '../constants/TaskSortField';

const INITIAL_APP_STATE: AppState = {
    tasks: [],
    projects: [],
    labels: [],
    isSyncing: false,
};

const INITIAL_CONFIG_STATE: ConfigState = {
    common: {
        todoistToken: '',
        minutesToUsePerDay: 240,
        estimatedLabels: {
            dict: {},
            yaml: ''
        },
        minutesToUsePerSpecificDays: {
            dict: {},
            yaml: ''
        },
        iconsByProject: {
            dict: {},
            yaml: ''
        },
        taskSortField: TaskSortField.PROJECT_NAME,
        taskOrder: Order.ASC,
    }
};

const appState = (state: AppState = INITIAL_APP_STATE, action: Actions): AppState => {
    switch (action.type) {
        case SYNC:
            return Object.assign({}, state, {isSyncing: true});
        case SUCCESS_SYNC:
            return Object.assign({}, state, {
                tasks: action.payload.tasks,
                projects: action.payload.projects,
                labels: action.payload.labels,
                isSyncing: false,
            });
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

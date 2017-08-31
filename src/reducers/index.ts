import * as _ from 'lodash';
import {reducer as toastrReducer} from 'react-redux-toastr'
import {combineReducers, Reducer} from 'redux';
import {Actions, default as ActionType} from '../actions';
import {AppState} from '../states/AppState';
import Order from '../constants/Order';
import TaskSortField from '../constants/TaskSortField';
import RootState from '../states/index';
import {firebaseStateReducer} from 'react-redux-firebase'
import {SharedState} from "../states/SharedState";
import {StorageState} from '../states/StorageState';


const INITIAL_APP_STATE: AppState = {
    tasksById: {},
    projects: [],
    labels: [],
    isSyncing: true,
};

export const INITIAL_SHARED_STATE: SharedState = {
    config: {
        minutesToUsePerDay: 240,
        estimates: {
            array: [],
            yaml: '',
        },
        milestones: {
            array: [],
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
        colorsByTaskNameRegexp: {
            dict: {},
            yaml: ''
        },
    },
};

export const INITIAL_STORAGE_STATE: StorageState = {
    todoist: {
        token: '',
        updating: false,
    },
    uiConfig: {
        icebox: false,
        timeLamps: true,
        milestone: true,
        warning: true,
        isTasksExpanded: false,
        taskSortField: TaskSortField.PROJECT_NAME,
        taskOrder: Order.ASC,
        numberOfCardsPerRow: 5,
        numberOfCards: 30,
        onlyWeekday: true,
    },
};

export const INITIAL_ROOT_STATE: RootState = {
    app: INITIAL_APP_STATE,
    storage: INITIAL_STORAGE_STATE,
    firebase: INITIAL_SHARED_STATE,
};

const appState = (state: AppState = INITIAL_APP_STATE, action: Actions): AppState => {
    switch (action.type) {
        case ActionType.SYNC:
            return Object.assign({}, state, {isSyncing: true});
        case ActionType.SUCCESS_SYNC:
            return Object.assign({}, state, {
                tasksById: action.payload.tasksById,
                projects: action.payload.projects,
                labels: action.payload.labels,
                isSyncing: false,
                error: null,
            });
        case ActionType.ERROR_SYNC:
            return Object.assign({}, state, {
                error: action.error,
                isSyncing: false,
            });
        case ActionType.UPDATE_TASKS:
            return Object.assign({}, state, {
                tasksById: Object.assign({}, state.tasksById,
                    _(action.payload)
                        .map(x => Object.assign({}, state.tasksById[x.id], {dueDate: x.dueDate}))
                        .keyBy(x => x.id)
                        .value()
                )
            });
        case ActionType.SUCCESS_UPDATE_TASKS:
            return Object.assign({}, state, {
                tasksById: action.payload,
                isSyncing: false,
                error: null,
            });
        case ActionType.ERROR_UPDATE_TASKS:
            return Object.assign({}, state, {
                error: action.error,
            });
        default:
            return state;
    }
};

const storageState = (state: StorageState = INITIAL_STORAGE_STATE, action: Actions): StorageState => {
    switch (action.type) {
        case ActionType.UPDATE_UI_CONFIG:
            return Object.assign({}, state, {uiConfig: action.payload});
        case ActionType.UPDATE_TODOIST_TOKEN:
            return Object.assign({}, state, {
                todoist: {token: null, error: null, updating: true,}
            });
        case ActionType.SUCCESS_UPDATE_TODOIST_TOKEN:
            return Object.assign({}, state, {
                todoist: {token: action.payload, error: null, updating: false,}
            });
        case ActionType.ERROR_UPDATE_TODOIST_TOKEN:
            return Object.assign({}, state, {
                todoist: {token: action.payload, error: action.error, updating: false,}
            });
        default:
            return state;
    }
};

export default combineReducers({
    app: appState as Reducer<any>,
    storage: storageState as Reducer<any>,
    toastr: toastrReducer,
    firebase: firebaseStateReducer,
});

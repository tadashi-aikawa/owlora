import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import ActionType, {errorSync, errorUpdateTasks, successSync, successUpdateTasks} from '../actions';
import SyncPayload from '../payloads/SyncPayload';
import TodoistSyncService from '../services/TodoistSyncService';
import SyncService from '../services/SyncService';
import Task from '../models/Task';
import {
    errorUpdateTodoistToken,
    LoginAction,
    LogoutAction,
    successUpdateTodoistToken,
    UpdateConfigAction,
    UpdateTasksAction,
    UpdateTodoistTokenAction,
} from '../actions/index';
import {Dictionary} from "lodash";
import {config} from "../utils/FirebasePathUtil";

const service: SyncService = new TodoistSyncService();

export function* sync() {
    try {
        const payload: SyncPayload = yield call(service.sync);
        yield put(successSync(payload));
    } catch (e) {
        console.log(e);
        yield put(errorSync(e));
    }
}

export function* updateTasks(action: UpdateTasksAction) {
    try {
        const tasks: Dictionary<Task> = yield call(service.updateTasks, action.payload);
        yield put(successUpdateTasks(tasks));
    } catch (e) {
        console.log(e);
        yield put(errorUpdateTasks({
            name: 'Failure update task',
            message: `${action.payload.map(x => `${x.name}\n`)}`
        }));
    }
}

export function* login(action: LoginAction) {
    try {
        const r = yield action.payload.login({provider: 'google'});
    } catch (e) {
        // TODO: error toaster
        console.log(e);
    }
}

export function* logout(action: LogoutAction) {
    try {
        yield action.payload.logout();
    } catch (e) {
        // TODO: error toaster
        console.log(e);
    }
}

export function* updateConfig(action: UpdateConfigAction) {
    try {
        yield action.payload.firebase.set(config(action.payload.firebase), action.payload.config);
    } catch (e) {
        // TODO: error toaster
        console.log(e);
    }
}

export function* updateTodoistToken(action: UpdateTodoistTokenAction) {
    try {
        yield call(service.ping, action.payload);
        yield put(successUpdateTodoistToken(action.payload));
    } catch (e) {
        console.log(e);
        yield put(errorUpdateTodoistToken(action.payload, e));
    }
}


export default function* () {
    yield takeLatest(ActionType.SYNC, sync);
    yield takeLatest(ActionType.LOGIN, login);
    yield takeLatest(ActionType.LOGOUT, logout);
    yield takeLatest(ActionType.UPDATE_CONFIG, updateConfig);
    yield takeLatest(ActionType.UPDATE_TODOIST_TOKEN, updateTodoistToken);

    yield takeEvery(ActionType.UPDATE_TASKS, updateTasks);
}

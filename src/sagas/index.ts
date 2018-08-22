import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import ActionType, {
    errorRemoveTasks,
    errorSync, errorUpdateTasks, RemoveTasksAction, successRemoveTasks, successSync,
    successUpdateTasks
} from '../actions';
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
import {config, configPath} from "../utils/FirebaseUtil";
import {commonConfigValueSelector, firebaseSelector, todoistTokenSelector} from '../reducers/selectors';
import {CommonConfigValue} from '../models/CommonConfig';
import {getFirebase} from "react-redux-firebase"

const service: SyncService = new TodoistSyncService();

export function* sync() {
    const token: string = yield select(todoistTokenSelector);
    const config: CommonConfigValue = yield select(commonConfigValueSelector);

    try {
        const payload: SyncPayload = yield call(service.sync, token, config);
        yield put(successSync(payload));
    } catch (e) {
        console.log(e);
        yield put(errorSync({
            name: 'Failure fetch data',
            message: "",
        }));
    }
}

export function* updateTasks(action: UpdateTasksAction) {
    const token: string = yield select(todoistTokenSelector);
    const config: CommonConfigValue = yield select(commonConfigValueSelector);

    try {
        const tasks: Dictionary<Task> = yield call(service.updateTasks, token, action.payload, config);
        yield put(successUpdateTasks(tasks));
    } catch (e) {
        console.log(e);
        yield put(errorUpdateTasks({
            name: 'Failure update task',
            message: `${action.payload.map(x => `${x.name}\n`)}`,
        }));
    }
}

export function* removeTasks(action: RemoveTasksAction) {
    const token: string = yield select(todoistTokenSelector);
    const config: CommonConfigValue = yield select(commonConfigValueSelector);

    try {
        const tasks: Dictionary<Task> = yield call(service.removeTasks, token, action.payload, config);
        yield put(successRemoveTasks(tasks));
    } catch (e) {
        console.log(e);
        yield put(errorRemoveTasks({
            name: 'Failure remove task',
            message: `${action.payload}`,
        }));
    }
}

export function* login() {
    const firebase: any = getFirebase()
    try {
        const r = yield firebase.login({provider: 'google'});
    } catch (e) {
        // TODO: error toaster
        console.log(e);
    }
}

export function* logout() {
    const firebase: any = getFirebase()
    try {
        yield firebase.logout();
    } catch (e) {
        // TODO: error toaster
        console.log(e);
    }
}

export function* updateConfig(action: UpdateConfigAction) {
    const firebase: any = getFirebase()
    const firebaseState = yield select(firebaseSelector)
    try {
        yield firebase.set(configPath(firebaseState), action.payload);
        // yield firebase.set("config/fJk7u46HgdgLGF5ZRwiAuktoLqj2", action.payload);
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
    yield takeEvery(ActionType.REMOVE_TASKS, removeTasks);
}

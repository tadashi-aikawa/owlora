import {call, put, takeEvery} from 'redux-saga/effects';
import ActionType, {errorSync, errorUpdateTasks, successSync, successUpdateTasks} from '../actions';
import SyncPayload from '../payloads/SyncPayload';
import TodoistSyncService from './TodoistSyncService';
import SyncService from './SyncService';
import Task from '../models/Task';
import {UpdateTasksAction} from '../actions/index';
import {Dictionary} from "lodash";

const service: SyncService = new TodoistSyncService();

export function* sync() {
    try {
        const payload: SyncPayload = yield call(service.sync);
        yield put(successSync(payload));
    } catch (e) {
        yield put(errorSync(e));
    }
}

export function* updateTasks(action: UpdateTasksAction) {
    try {
        const tasks: Dictionary<Task> = yield call(service.updateTasks, action.payload);
        yield put(successUpdateTasks(tasks));
    } catch (e) {
        yield put(errorUpdateTasks({
            name: 'Failure update task',
            message: `${action.payload.map(x => `${x.name}\n`)}`
        }));
    }
}

export default function* () {
    yield takeEvery(ActionType.SYNC, sync);
    yield takeEvery(ActionType.UPDATE_TASKS, updateTasks);
    yield call(sync);
}

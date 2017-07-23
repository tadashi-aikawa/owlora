import {call, fork, put, take, takeEvery} from 'redux-saga/effects';
import * as actions from '../actions';
import SyncPayload from '../payloads/SyncPayload';
import TodoistSyncService from './TodoistSyncService';
import SyncService from './SyncService';
import Task, {TaskUpdateParameter} from '../models/Task';
import {UpdateTasksAction} from '../actions/index';

const service: SyncService = new TodoistSyncService();

export function* sync() {
    try {
        const payload: SyncPayload = yield call(service.sync);
        yield put(actions.successSync(payload));
    } catch (e) {
        yield put(actions.errorSync(e));
    }
}

export function* updateTasks(action: UpdateTasksAction) {
    try {
        const tasks: Task[] = yield call(service.updateTasks, action.payload);
        yield put(actions.successUpdateTasks(tasks));
    } catch (e) {
        yield put(actions.errorUpdateTasks(e));
    }
}

export default function* () {
    yield takeEvery(actions.SYNC, sync);
    yield takeEvery(actions.UPDATE_TASKS, updateTasks);
    yield call(sync);
}

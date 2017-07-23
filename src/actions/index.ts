import {Action} from 'redux';
import CommonConfig from '../models/CommonConfig';
import SyncPayload from '../payloads/SyncPayload';
import {default as Task, TaskUpdateParameter} from '../models/Task';

export const SYNC = 'SYNC';
export const SUCCESS_SYNC = 'SUCCESS_SYNC';
export const ERROR_SYNC = 'ERROR_SYNC';

export const UPDATE_TASKS = 'UPDATE_TASKS';
export const SUCCESS_UPDATE_TASKS = 'SUCCESS_UPDATE_TASKS';
export const ERROR_UPDATE_TASKS = 'ERROR_UPDATE_TASKS';

export const UPDATE_COMMON_CONFIG = 'UPDATE_COMMON_CONFIG';

export interface SyncAction extends Action {
    type: 'SYNC';
}
export interface SuccessSyncAction extends Action {
    type: 'SUCCESS_SYNC';
    payload: SyncPayload;
}
export interface ErrorSyncAction extends Action {
    type: 'ERROR_SYNC';
    error: Error;
}

export interface UpdateTasksAction extends Action {
    type: 'UPDATE_TASKS';
    payload: TaskUpdateParameter[];
}
export interface SuccessUpdateTasksAction extends Action {
    type: 'SUCCESS_UPDATE_TASKS';
    payload: Task[];
}
export interface ErrorUpdateTasksAction extends Action {
    type: 'ERROR_UPDATE_TASKS';
    error: Error;
}

export interface UpdateCommonConfigAction extends Action {
    type: 'UPDATE_COMMON_CONFIG';
    payload: CommonConfig;
}

export type Actions =
    SyncAction |
    SuccessSyncAction |
    ErrorSyncAction |
    UpdateTasksAction |
    SuccessUpdateTasksAction |
    ErrorUpdateTasksAction |
    UpdateCommonConfigAction;

export function sync(): SyncAction {
    return {type: SYNC}
}
export function successSync(payload: SyncPayload): SuccessSyncAction {
    return {type: SUCCESS_SYNC, payload}
}
export function errorSync(error: Error): ErrorSyncAction {
    return {type: ERROR_SYNC, error}
}

export function updateTasks(taskUpdateParameters: TaskUpdateParameter[]): UpdateTasksAction {
    return {type: UPDATE_TASKS, payload: taskUpdateParameters}
}
export function successUpdateTasks(tasks: Task[]): SuccessUpdateTasksAction {
    return {type: SUCCESS_UPDATE_TASKS, payload: tasks}
}
export function errorUpdateTasks(error: Error): ErrorUpdateTasksAction {
    return {type: ERROR_UPDATE_TASKS, error}
}

export function updateCommonConfig(config: CommonConfig): UpdateCommonConfigAction {
    return {type: UPDATE_COMMON_CONFIG, payload: config}
}

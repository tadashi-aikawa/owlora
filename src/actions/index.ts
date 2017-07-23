import {Action} from 'redux';
import CommonConfig from '../models/CommonConfig';
import SyncPayload from '../payloads/SyncPayload';
import {default as Task, TaskUpdateParameter} from '../models/Task';
import {Dictionary} from 'lodash';

enum ActionType {
    SYNC = 'SYNC',
    SUCCESS_SYNC = 'SUCCESS_SYNC',
    ERROR_SYNC = 'ERROR_SYNC',

    UPDATE_TASKS = 'UPDATE_TASKS',
    SUCCESS_UPDATE_TASKS = 'SUCCESS_UPDATE_TASKS',
    ERROR_UPDATE_TASKS = 'ERROR_UPDATE_TASKS',

    UPDATE_COMMON_CONFIG = 'UPDATE_COMMON_CONFIG',
}

export interface SyncAction extends Action {
    type: ActionType.SYNC;
}
export interface SuccessSyncAction extends Action {
    type: ActionType.SUCCESS_SYNC;
    payload: SyncPayload;
}
export interface ErrorSyncAction extends Action {
    type: ActionType.ERROR_SYNC;
    error: Error;
}

export interface UpdateTasksAction extends Action {
    type: ActionType.UPDATE_TASKS;
    payload: TaskUpdateParameter[];
}
export interface SuccessUpdateTasksAction extends Action {
    type: ActionType.SUCCESS_UPDATE_TASKS;
    payload: Dictionary<Task>;
}
export interface ErrorUpdateTasksAction extends Action {
    type: ActionType.ERROR_UPDATE_TASKS;
    error: Error;
}

export interface UpdateCommonConfigAction extends Action {
    type: ActionType.UPDATE_COMMON_CONFIG;
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
    return {type: ActionType.SYNC}
}
export function successSync(payload: SyncPayload): SuccessSyncAction {
    return {type: ActionType.SUCCESS_SYNC, payload}
}
export function errorSync(error: Error): ErrorSyncAction {
    return {type: ActionType.ERROR_SYNC, error}
}

export function updateTasks(taskUpdateParameters: TaskUpdateParameter[]): UpdateTasksAction {
    return {type: ActionType.UPDATE_TASKS, payload: taskUpdateParameters}
}
export function successUpdateTasks(tasksById: Dictionary<Task>): SuccessUpdateTasksAction {
    return {type: ActionType.SUCCESS_UPDATE_TASKS, payload: tasksById}
}
export function errorUpdateTasks(error: Error): ErrorUpdateTasksAction {
    return {type: ActionType.ERROR_UPDATE_TASKS, error}
}

export function updateCommonConfig(config: CommonConfig): UpdateCommonConfigAction {
    return {type: ActionType.UPDATE_COMMON_CONFIG, payload: config}
}

export default ActionType;

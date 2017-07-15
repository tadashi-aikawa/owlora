import {Action} from 'redux';
import Task from '../models/Task';
import CommonConfig from '../models/CommonConfig';

export const FETCH_TASKS = 'FETCH_TASKS';
export const SUCCESS_FETCH_TASKS = 'SUCCESS_FETCH_TASKS';
export const UPDATE_COMMON_CONFIG = 'UPDATE_COMMON_CONFIG';

export interface FetchTasksAction extends Action {
    type: 'FETCH_TASKS';
}

export interface SuccessFetchTasksAction extends Action {
    type: 'SUCCESS_FETCH_TASKS';
    payload: Task[];
}

export interface UpdateCommonConfigAction extends Action {
    type: 'UPDATE_COMMON_CONFIG';
    payload: CommonConfig;
}

export type Actions =
    FetchTasksAction |
    SuccessFetchTasksAction |
    UpdateCommonConfigAction;

export function fetchTasks(): FetchTasksAction {
    return {type: FETCH_TASKS}
}

export function successFetchTasks(tasks: Task[]): SuccessFetchTasksAction {
    return {type: SUCCESS_FETCH_TASKS, payload: tasks}
}

export function updateCommonConfig(config: CommonConfig): UpdateCommonConfigAction {
    return {type: UPDATE_COMMON_CONFIG, payload: config}
}

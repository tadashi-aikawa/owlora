import {Action} from 'redux';
import Task from '../models/Task';

export const FETCH_TASKS = 'FETCH_TASKS';
export const SUCCESS_FETCH_TASKS = 'SUCCESS_FETCH_TASKS';

export interface FetchTasksAction extends Action {
    type: 'FETCH_TASKS';
}

export interface SuccessFetchTasksAction extends Action {
    type: 'SUCCESS_FETCH_TASKS';
    tasks: Task[];
}

export type Actions = FetchTasksAction | SuccessFetchTasksAction;

export function fetchTasks(): FetchTasksAction {
    return {type: FETCH_TASKS}
}

export function successFetchTasks(tasks: Task[]): SuccessFetchTasksAction {
    return {type: SUCCESS_FETCH_TASKS, tasks}
}

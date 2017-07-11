import {Action} from 'redux';
import Task from '../models/Task';

export const FETCH_TASKS = 'FETCH_TASKS';
export const SUCCESS_FETCH_TASKS = 'SUCCESS_FETCH_TASKS';
export const UPDATE_TODOIST_API_TOKEN = 'UPDATE_TODOIST_API_TOKEN';

export interface FetchTasksAction extends Action {
    type: 'FETCH_TASKS';
}

export interface SuccessFetchTasksAction extends Action {
    type: 'SUCCESS_FETCH_TASKS';
    tasks: Task[];
}

export interface UpdateTodoistApiTokenAction extends Action {
    type: 'UPDATE_TODOIST_API_TOKEN';
    apiToken: string;
}

export type Actions = FetchTasksAction | SuccessFetchTasksAction | UpdateTodoistApiTokenAction;

export function fetchTasks(): FetchTasksAction {
    return {type: FETCH_TASKS}
}

export function successFetchTasks(tasks: Task[]): SuccessFetchTasksAction {
    return {type: SUCCESS_FETCH_TASKS, tasks}
}

export function updateTodoistApiToken(apiToken: string): UpdateTodoistApiTokenAction {
    return {type: UPDATE_TODOIST_API_TOKEN, apiToken}
}

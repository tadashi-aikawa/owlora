import {Action} from 'redux';
import Task from '../models/Task';
import CommonConfig from '../models/CommonConfig';
import Project from '../models/Project';
import FetchTodoist from '../payloads/FetchTodoist';

export const FETCH_TODOIST = 'FETCH_TODOIST';
export const SUCCESS_FETCH_TODOIST = 'SUCCESS_FETCH_TODOIST';
export const UPDATE_COMMON_CONFIG = 'UPDATE_COMMON_CONFIG';

export interface FetchTodistAction extends Action {
    type: 'FETCH_TODOIST';
}

export interface SuccessFetchTodoistAction extends Action {
    type: 'SUCCESS_FETCH_TODOIST';
    payload: FetchTodoist;
}

export interface UpdateCommonConfigAction extends Action {
    type: 'UPDATE_COMMON_CONFIG';
    payload: CommonConfig;
}

export type Actions =
    FetchTodistAction |
    SuccessFetchTodoistAction |
    UpdateCommonConfigAction;

export function fetchTodoist(): FetchTodistAction {
    return {type: FETCH_TODOIST}
}

export function successFetchTodoist(tasks: Task[], projects: Project[]): SuccessFetchTodoistAction {
    return {type: SUCCESS_FETCH_TODOIST, payload: {tasks, projects}}
}

export function updateCommonConfig(config: CommonConfig): UpdateCommonConfigAction {
    return {type: UPDATE_COMMON_CONFIG, payload: config}
}

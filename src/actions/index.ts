import {Action} from 'redux';
import CommonConfig from '../models/CommonConfig';
import SyncPayload from '../payloads/SyncPayload';
import {default as Task, TaskUpdateParameter} from '../models/Task';
import {Dictionary} from 'lodash';
import UiConfig from '../models/UiConfig';
import {getFirebase} from 'react-redux-firebase';

enum ActionType {
    SYNC = 'SYNC',
    SUCCESS_SYNC = 'SUCCESS_SYNC',
    ERROR_SYNC = 'ERROR_SYNC',

    UPDATE_TASKS = 'UPDATE_TASKS',
    SUCCESS_UPDATE_TASKS = 'SUCCESS_UPDATE_TASKS',
    ERROR_UPDATE_TASKS = 'ERROR_UPDATE_TASKS',

    UPDATE_UI_CONFIG = 'UPDATE_UI_CONFIG',

    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',

    UPDATE_CONFIG = 'UPDATE_CONFIG',

    UPDATE_TODOIST_TOKEN = 'UPDATE_TODOIST_TOKEN',
    SUCCESS_UPDATE_TODOIST_TOKEN = 'SUCCESS_UPDATE_TODOIST_TOKEN',
    ERROR_UPDATE_TODOIST_TOKEN = 'ERROR_UPDATE_TODOIST_TOKEN',
}

export interface SyncAction extends Action {
    type: ActionType.SYNC;
    payload: boolean;
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

export interface UpdateUiConfigAction extends Action {
    type: ActionType.UPDATE_UI_CONFIG;
    payload: UiConfig;
}

export interface LoginAction extends Action {
    type: ActionType.LOGIN;
    // TODO: firebase
    payload: any;
}

export interface LogoutAction extends Action {
    type: ActionType.LOGOUT;
    // TODO: firebase
    payload: any;
}

export interface UpdateConfigAction extends Action {
    type: ActionType.UPDATE_CONFIG;
    // TODO: firebase
    payload: {
        firebase: any,
        config: CommonConfig,
    };
}

export interface UpdateTodoistTokenAction extends Action {
    type: ActionType.UPDATE_TODOIST_TOKEN;
    payload: string;
}

export interface SuccessUpdateTodoistTokenAction extends Action {
    type: ActionType.SUCCESS_UPDATE_TODOIST_TOKEN;
    payload: string;
}

export interface ErrorUpdateTodoistTokenAction extends Action {
    type: ActionType.ERROR_UPDATE_TODOIST_TOKEN;
    payload: string;
    error: Error;
}

export type Actions =
    SyncAction |
    SuccessSyncAction |
    ErrorSyncAction |
    UpdateTasksAction |
    SuccessUpdateTasksAction |
    ErrorUpdateTasksAction |
    UpdateUiConfigAction |
    LoginAction |
    LogoutAction |
    UpdateConfigAction |
    UpdateTodoistTokenAction |
    SuccessUpdateTodoistTokenAction |
    ErrorUpdateTodoistTokenAction;

export function sync(guard: boolean=true): SyncAction {
    return {type: ActionType.SYNC, payload: guard}
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

export function updateUiConfig(config: UiConfig): UpdateUiConfigAction {
    return {type: ActionType.UPDATE_UI_CONFIG, payload: config}
}

export function login(): LoginAction {
    return {type: ActionType.LOGIN, payload: getFirebase()}
}

export function logout(): LogoutAction {
    return {type: ActionType.LOGOUT, payload: getFirebase()}
}

export function updateConfig(config: CommonConfig): UpdateConfigAction {
    return {type: ActionType.UPDATE_CONFIG, payload: {firebase: getFirebase(), config}}
}

export function updateTodoistToken(token: string): UpdateTodoistTokenAction {
    return {type: ActionType.UPDATE_TODOIST_TOKEN, payload: token}
}

export function successUpdateTodoistToken(token: string): SuccessUpdateTodoistTokenAction {
    return {type: ActionType.SUCCESS_UPDATE_TODOIST_TOKEN, payload: token}
}

export function errorUpdateTodoistToken(token: string, error: Error): ErrorUpdateTodoistTokenAction {
    return {type: ActionType.ERROR_UPDATE_TODOIST_TOKEN, payload: token, error}
}

export default ActionType;

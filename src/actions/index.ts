import {Action} from 'redux';
import CommonConfig from '../models/CommonConfig';
import SyncPayload from '../payloads/SyncPayload';

export const SYNC = 'SYNC';
export const SUCCESS_SYNC = 'SUCCESS_SYNC';
export const ERROR_SYNC = 'ERROR_SYNC';
export const UPDATE_COMMON_CONFIG = 'UPDATE_COMMON_CONFIG';

export interface SyncAction extends Action {
    type: 'SYNC';
}

export interface SuccessSync extends Action {
    type: 'SUCCESS_SYNC';
    payload: SyncPayload;
}

export interface ErrorSync extends Action {
    type: 'ERROR_SYNC';
    error: any;
}

export interface UpdateCommonConfigAction extends Action {
    type: 'UPDATE_COMMON_CONFIG';
    payload: CommonConfig;
}

export type Actions =
    SyncAction |
    SuccessSync |
    ErrorSync |
    UpdateCommonConfigAction;

export function sync(): SyncAction {
    return {type: SYNC}
}

export function successSync(payload: SyncPayload): SuccessSync {
    return {type: SUCCESS_SYNC, payload}
}

export function errorSync(error: any): ErrorSync {
    return {type: ERROR_SYNC, error}
}

export function updateCommonConfig(config: CommonConfig): UpdateCommonConfigAction {
    return {type: UPDATE_COMMON_CONFIG, payload: config}
}

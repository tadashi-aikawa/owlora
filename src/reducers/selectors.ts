import RootState from '../states/index';
import {config} from "../utils/FirebaseUtil";
import {CommonConfigValue} from '../models/CommonConfig';

const arrayOrEmpty = x => x ? x.array : [];
const dictOrEmpty = x => x && x.dict ? x.dict : {};

export const firebaseSelector = (state: RootState): any =>
    state.firebase;

export const todoistTokenSelector = (state: RootState): string =>
    state.storage.todoist.token;

export const commonConfigValueSelector = (state: RootState): CommonConfigValue => ({
    estimates: arrayOrEmpty(config(state.firebase).estimates),
    milestones: arrayOrEmpty(config(state.firebase).milestones),
    seals: arrayOrEmpty(config(state.firebase).seals),
    iconsByProject: dictOrEmpty(config(state.firebase).iconsByProject),
    colorsByTaskNameRegexp: dictOrEmpty(config(state.firebase).colorsByTaskNameRegexp),
});

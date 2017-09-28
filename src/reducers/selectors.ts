import RootState from '../states/index';
import {dataToJS, getFirebase} from 'react-redux-firebase'
import {config} from "../utils/FirebasePathUtil";
import {CommonConfigValue} from '../models/CommonConfig';

const arrayOrEmpty = x => x ? x.array : [];

export const todoistTokenSelector = (state: RootState): string =>
    state.storage.todoist.token;

export const commonConfigValueSelector = (state: RootState): CommonConfigValue => ({
    estimates: arrayOrEmpty(dataToJS(state.firebase, config(getFirebase())).estimates),
    milestones: arrayOrEmpty(dataToJS(state.firebase, config(getFirebase())).milestones),
    seals: arrayOrEmpty(dataToJS(state.firebase, config(getFirebase())).seals),
    iconsByProject: dataToJS(state.firebase, config(getFirebase())).iconsByProject.dict || {},
    colorsByTaskNameRegexp: dataToJS(state.firebase, config(getFirebase())).colorsByTaskNameRegexp.dict || {},
});

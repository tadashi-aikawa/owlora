import RootState from '../states/index';
import {Dictionary} from 'lodash';
import MilestoneConfig from '../models/MilestoneConfig';
import {dataToJS, getFirebase} from 'react-redux-firebase'
import {config} from "../utils/FirebasePathUtil";
import EstimateConfig from '../models/EstimateConfig';
import SealConfig from '../models/SealConfig';

export const todoistTokenSelector = (state: RootState): string =>
    state.storage.todoist.token;
export const estimatesSelector = (state: RootState): EstimateConfig[] => {
    const x = dataToJS(state.firebase, config(getFirebase())).estimates;
    return x ? x.array : [];
};
export const milestonesSelector = (state: RootState): MilestoneConfig[] => {
    const x = dataToJS(state.firebase, config(getFirebase())).milestones;
    return x ? x.array : [];
};
export const sealsSelector = (state: RootState): SealConfig[] => {
    const x = dataToJS(state.firebase, config(getFirebase())).seals;
    return x ? x.array : [];
};
export const iconsByProjectSelector = (state: RootState): Dictionary<string> =>
    dataToJS(state.firebase, config(getFirebase())).iconsByProject.dict || {};
export const colorsByTaskNameRegexpSelector = (state: RootState): Dictionary<string> =>
    dataToJS(state.firebase, config(getFirebase())).colorsByTaskNameRegexp.dict || {};

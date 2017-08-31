import RootState from '../states/index';
import {Dictionary} from 'lodash';
import MilestoneConfig from '../models/MilestoneConfig';
import {dataToJS, getFirebase} from 'react-redux-firebase'
import {config} from "../utils/FirebasePathUtil";
import EstimateConfig from '../models/EstimateConfig';

export const todoistTokenSelector = (state: RootState): string =>
    state.storage.todoist.token;
export const estimatesSelector = (state: RootState): EstimateConfig[] =>
    dataToJS(state.firebase, config(getFirebase())).estimates ?
        dataToJS(state.firebase, config(getFirebase())).estimates.array :
        [];
export const milestonesSelector = (state: RootState): MilestoneConfig[] =>
    dataToJS(state.firebase, config(getFirebase())).milestones.array;
export const iconsByProjectSelector = (state: RootState): Dictionary<string> =>
    dataToJS(state.firebase, config(getFirebase())).iconsByProject.dict || {};
export const colorsByTaskNameRegexpSelector = (state: RootState): Dictionary<string> =>
    dataToJS(state.firebase, config(getFirebase())).colorsByTaskNameRegexp.dict || {};

import RootState from '../states/index';
import {Dictionary} from 'lodash';
import MilestoneConfig from '../models/MilestoneConfig';
import {dataToJS, getFirebase} from 'react-redux-firebase'
import {config} from "../utils/FirebasePathUtil";

export const todoistTokenSelector = (state: RootState): string =>
    state.storage.todoist.token;
export const estimatedLabelsSelector = (state: RootState): Dictionary<number> =>
    dataToJS(state.firebase, config(getFirebase())).estimatedLabels.dict || {};
export const milestonesSelector = (state: RootState): MilestoneConfig[] =>
    dataToJS(state.firebase, config(getFirebase())).milestones.array;
export const iconsByProjectSelector = (state: RootState): Dictionary<string> =>
    dataToJS(state.firebase, config(getFirebase())).iconsByProject.dict || {};
export const colorsByTaskNameRegexpSelector = (state: RootState): Dictionary<string> =>
    dataToJS(state.firebase, config(getFirebase())).colorsByTaskNameRegexp.dict || {};

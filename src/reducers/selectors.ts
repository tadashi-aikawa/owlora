import RootState from '../states/index';
import {Dictionary} from 'lodash';
import MilestoneConfig from '../models/MilestoneConfig';
import {dataToJS} from 'react-redux-firebase'

export const todoistTokenSelector = (state: RootState): string =>
    state.storage.todoist.token;
export const estimatedLabelsSelector = (state: RootState): Dictionary<number> =>
    dataToJS(state.firebase, 'config').estimatedLabels.dict;
export const milestonesSelector = (state: RootState): MilestoneConfig[] =>
    dataToJS(state.firebase, 'config').milestones.array;
export const iconsByProjectSelector = (state: RootState): Dictionary<string> =>
    dataToJS(state.firebase, 'config').iconsByProject.dict;
export const colorsByTaskNameRegexpSelector = (state: RootState): Dictionary<string> =>
    dataToJS(state.firebase, 'config').colorsByTaskNameRegexp.dict;

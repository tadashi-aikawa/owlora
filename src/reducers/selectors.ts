import RootState from '../states/index';
import {Dictionary} from 'lodash';
import MilestoneConfig from '../models/MilestoneConfig';

export const todoistTokenSelector = (state: RootState): string =>
    state.config.common.todoistToken;
export const estimatedLabelsSelector = (state: RootState): Dictionary<number> =>
    state.config.common.estimatedLabels.dict;
export const milestonesSelector = (state: RootState): MilestoneConfig[] =>
    state.config.common.milestones.array;
export const iconsByProjectSelector = (state: RootState): Dictionary<string> =>
    state.config.common.iconsByProject.dict;
export const colorsByTaskNameRegexpSelector = (state: RootState): Dictionary<string> =>
    state.config.common.colorsByTaskNameRegexp.dict;

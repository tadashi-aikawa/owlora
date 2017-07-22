import RootState from '../states/index';
import {Dictionary} from 'lodash';
export const todoistTokenSelector = (state: RootState): string =>
    state.config.common.todoistToken;
export const estimatedLabelsSelector = (state: RootState): Dictionary<number> =>
    state.config.common.estimatedLabels.dict;
export const milestoneLabelSelector = (state: RootState): number =>
    state.config.common.milestoneLabel;
export const iconsByProjectSelector = (state: RootState): Dictionary<string> =>
    state.config.common.iconsByProject.dict;

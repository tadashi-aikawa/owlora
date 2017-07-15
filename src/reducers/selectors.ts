import RootState from '../states/index';
export const todoistTokenSelector = (state: RootState) => state.config.common.todoistToken;
export const estimatedLabelsSelector = (state: RootState) => state.config.common.estimatedLabels;


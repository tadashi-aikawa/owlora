import RootState from '../states/index';
export const todoistTokenSelector = (state: RootState) => state.config.todoistToken;
export const estimatedLabelsSelector = (state: RootState) => state.config.estimatedLabels;

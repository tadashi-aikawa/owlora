import RootState from '../states/index';
export const todoistTokenSelector = (state: RootState) => state.appState.todoistToken;
export const estimatedLabelsSelector = (state: RootState) => state.appState.estimatedLabels;

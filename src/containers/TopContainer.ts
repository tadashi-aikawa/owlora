import * as _ from 'lodash';
import {connect} from 'react-redux';
import Top from '../components/Top';
import {
    login, logout, sync, updateConfig, updateFilter, updateTasks, updateTodoistToken,
    updateUiConfig, removeTasks
} from '../actions/index';
import RootState from '../states/index';
import CommonConfig from '../models/CommonConfig';
import {TaskUpdateParameter} from '../models/Task';
import UiConfig from '../models/UiConfig';
import {dataToJS, firebaseConnect, getFirebase, pathToJS} from 'react-redux-firebase'
import {config} from "../utils/FirebasePathUtil";
import Filter from '../models/Filter';

const mapStateToProps = (state: RootState) => ({
    tasks: _.values(state.app.tasksById),
    projects: state.app.projects,
    labels: state.app.labels,
    error: state.app.error,
    isLoading: state.app.isSyncing,
    guardLoading: state.app.guardSyncing,

    config: dataToJS(state.firebase, config(getFirebase())),
    uiConfig: state.storage.uiConfig,
    filter: state.app.filter,

    token: state.storage.todoist.token,
    isTokenUpdating: state.storage.todoist.updating,
    tokenUpdateError: state.storage.todoist.error,

    authError: pathToJS(state.firebase, 'authError'),
    auth: pathToJS(state.firebase, 'auth'),
    profile: pathToJS(state.firebase, 'profile'),
});

const mapDispatchToProps = (dispatch) => {
    return {
        onReload: () => {
            dispatch(sync())
        },
        onBackgroundReload: () => {
            dispatch(sync(false))
        },
        onChangeConfig: (config: CommonConfig) => {
            dispatch(updateConfig(config));
        },
        onChangeUiConfig: (config: UiConfig) => {
            dispatch(updateUiConfig(config));
        },
        onChangeFilter: (filter: Filter) => {
            dispatch(updateFilter(filter))
        },
        onUpdateTask: (parameter: TaskUpdateParameter) => {
            dispatch(updateTasks([parameter]));
        },
        onRemoveTask: (id: number) => {
            dispatch(removeTasks([id]));
        },
        onUpdateToken: (token: string) => {
            dispatch(updateTodoistToken(token));
        },
        onLogin: (provider: string) => {
            // TODO: provider
            dispatch(login());
        },
        onLogout: () => {
            dispatch(logout());
        }
    }
};

const wrappedTop = firebaseConnect((props, firebase) => ([
    config(firebase)
]))(Top);

const TopContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(wrappedTop);

export default TopContainer;

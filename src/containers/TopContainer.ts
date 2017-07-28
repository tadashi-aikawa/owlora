import * as _ from 'lodash';
import {connect} from 'react-redux';
import Top from '../components/Top';
import {closeAllTask, openAllTask, sync, updateCommonConfig, updateTasks} from '../actions/index';
import RootState from '../states/index';
import CommonConfig from '../models/CommonConfig';
import {TaskUpdateParameter} from '../models/Task';

const mapStateToProps = (state: RootState) => ({
    tasks: _.values(state.app.tasksById),
    projects: state.app.projects,
    labels: state.app.labels,
    config: state.config.common,
    error: state.app.error,
    isLoading: state.app.isSyncing,
    isAllTaskOpen: state.app.isAllTaskOpen,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onReload: () => {
            dispatch(sync())
        },
        onChangeConfig: (config: CommonConfig) => {
            dispatch(updateCommonConfig(config));
        },
        onUpdateTask: (parameter: TaskUpdateParameter) => {
            dispatch(updateTasks([parameter]));
        },
        openAllTask: () => {
            dispatch(openAllTask())
        },
        closeAllTask: () => {
            dispatch(closeAllTask())
        }
    }
};

const TopContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);

export default TopContainer;

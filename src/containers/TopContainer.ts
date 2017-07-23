import {connect} from 'react-redux';
import Top from '../components/Top';
import {sync, updateCommonConfig, updateTasks} from '../actions/index';
import RootState from '../states/index';
import CommonConfig from '../models/CommonConfig';
import {TaskUpdateParameter} from '../models/Task';

const mapStateToProps = (state: RootState) => ({
    tasks: state.app.tasks,
    projects: state.app.projects,
    labels: state.app.labels,
    config: state.config.common,
    error: state.app.error,
    isLoading: state.app.isSyncing,
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
            dispatch(updateTasks([parameter]))
        }
    }
};

const TopContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);

export default TopContainer;

import {connect} from 'react-redux';
import Top from '../components/Top';
import {fetchTasks, updateCommonConfig} from '../actions/index';
import RootState from '../states/index';
import CommonConfig from '../models/CommonConfig';

const mapStateToProps = (state: RootState) => ({
    tasks: state.app.tasks,
    config: state.config.common,
    isLoading: state.app.isTaskLoading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onReload: () => {
        dispatch(fetchTasks())
    },
    onChangeConfig: (config: CommonConfig) => {
        dispatch(updateCommonConfig(config));
    }
});

const TasksContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);

export default TasksContainer;

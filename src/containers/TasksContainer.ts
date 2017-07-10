import {connect} from 'react-redux';
import {Top} from '../components/Top';
import {fetchTasks} from '../actions/index';
import RootState from '../states/index';

const mapStateToProps = (state: RootState) => ({
    tasks: state.appState.tasks,
    isLoading: state.appState.isTaskLoading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onReload: () => {
        dispatch(fetchTasks())
    }
});

const TasksContainer= connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);

export default TasksContainer;

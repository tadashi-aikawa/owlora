import {connect} from 'react-redux';
import {Top} from '../components/Top';
import {fetchTasks, updateTodoistApiToken} from '../actions/index';
import RootState from '../states/index';

const mapStateToProps = (state: RootState) => ({
    tasks: state.appState.tasks,
    apiToken: state.appState.todoistToken,
    isLoading: state.appState.isTaskLoading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onReload: () => {
        dispatch(fetchTasks())
    },
    onChangeTodoistToken: (token: string) => {
        dispatch(updateTodoistApiToken(token));
    }
});

const TasksContainer= connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);

export default TasksContainer;

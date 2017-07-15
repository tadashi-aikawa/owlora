import {connect} from 'react-redux';
import {Top} from '../components/Top';
import {fetchTasks, updateEstimatedLabels, updateTodoistApiToken} from '../actions/index';
import RootState from '../states/index';
import {Dictionary} from 'lodash';

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
    },
    onChangeEstimatedLabels: (estimatedLabels: Dictionary<number>) => {
        dispatch(updateEstimatedLabels(estimatedLabels));
    }
});

const TasksContainer= connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);

export default TasksContainer;

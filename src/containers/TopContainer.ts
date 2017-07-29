import * as _ from 'lodash';
import {connect} from 'react-redux';
import Top from '../components/Top';
import {
    setCardAppearance,
    setTaskVisibility,
    sync,
    updateCommonConfig,
    updateTasks
} from '../actions/index';
import RootState from '../states/index';
import CommonConfig from '../models/CommonConfig';
import {TaskUpdateParameter} from '../models/Task';
import CardAppearance from '../constants/CardAppearance';

const mapStateToProps = (state: RootState) => ({
    tasks: _.values(state.app.tasksById),
    projects: state.app.projects,
    labels: state.app.labels,
    config: state.config.common,
    error: state.app.error,
    isLoading: state.app.isSyncing,
    cardAppearance: state.app.cardAppearance,
    isIceboxVisible: state.app.isIceboxVisible,
});

const mapDispatchToProps = (dispatch) => {
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
        onChangeCardAppearance: (appearance: CardAppearance) => {
            dispatch(setCardAppearance(appearance));
        },
        onChangeIceboxVisibility: (visible: boolean) => {
            dispatch(setTaskVisibility(visible));
        }
    }
};

const TopContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);

export default TopContainer;

import {connect} from 'react-redux';
import Top from '../components/Top';
import {fetchTodoist, updateCommonConfig} from '../actions/index';
import RootState from '../states/index';
import CommonConfig from '../models/CommonConfig';

const mapStateToProps = (state: RootState) => ({
    tasks: state.app.tasks,
    projects: state.app.projects,
    labels: state.app.labels,
    config: state.config.common,
    isLoading: state.app.isTodoistLoading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onReload: () => {
        dispatch(fetchTodoist())
    },
    onChangeConfig: (config: CommonConfig) => {
        dispatch(updateCommonConfig(config));
    }
});

const TopContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);

export default TopContainer;

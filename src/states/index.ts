import {AppState} from './AppState';
import {ConfigState} from './ConfigState';

interface RootState {
    app: AppState,
    config: ConfigState
}

export default RootState;

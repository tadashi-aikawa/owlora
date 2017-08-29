import {AppState} from './AppState';
import {SharedState} from './SharedState';
import {StorageState} from './StorageState';

interface RootState {
    app: AppState,
    storage: StorageState,
    firebase?: SharedState,
}

export default RootState;

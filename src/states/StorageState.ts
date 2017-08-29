import UiConfig from '../models/UiConfig';
import Todoist from '../models/Todoist';

export interface StorageState {
    todoist: Todoist;
    uiConfig: UiConfig;
}

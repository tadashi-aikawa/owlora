import CommonConfig from '../models/CommonConfig';
import UiConfig from '../models/UiConfig';

export interface ConfigState {
    common: CommonConfig;
    ui: UiConfig;
}

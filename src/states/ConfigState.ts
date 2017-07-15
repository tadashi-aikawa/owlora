import {Dictionary} from 'lodash';

export interface ConfigState {
    todoistToken: string;
    estimatedLabels: Dictionary<number>;
}

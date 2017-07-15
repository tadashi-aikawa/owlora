import {Dictionary} from 'lodash';

interface CommonConfig {
    todoistToken: string;
    minutesToUsePerDay: number;
    estimatedLabels: Dictionary<number>;
}

export default CommonConfig;

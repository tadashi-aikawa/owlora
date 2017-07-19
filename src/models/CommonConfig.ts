import {Dictionary} from 'lodash';

interface CommonConfig {
    todoistToken: string;
    minutesToUsePerDay: number;
    estimatedLabels: Dictionary<number>;
    minutesToUsePerSpecificDays: Dictionary<number>;
    iconsByProject: Dictionary<string>;
}

export default CommonConfig;

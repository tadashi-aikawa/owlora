import {Dictionary} from 'lodash';
import MilestoneConfig from './MilestoneConfig';

interface DictAndYaml<T> {
    dict: Dictionary<T>;
    yaml: string;
}

interface ArrayAndYaml<T> {
    array: T[];
    yaml: string;
}

interface CommonConfig {
    todoistToken: string;
    minutesToUsePerDay: number;
    estimatedLabels: DictAndYaml<number>;
    milestones: ArrayAndYaml<MilestoneConfig>;
    minutesToUsePerSpecificDays: DictAndYaml<number>;
    iconsByProject: DictAndYaml<string>;
    colorsByTaskNameRegexp: DictAndYaml<string>;
}

export default CommonConfig;
export {
    DictAndYaml
}

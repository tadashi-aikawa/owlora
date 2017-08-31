import {Dictionary} from 'lodash';
import MilestoneConfig from './MilestoneConfig';
import EstimateConfig from './EstimateConfig';

interface DictAndYaml<T> {
    dict?: Dictionary<T>;
    yaml: string;
}

interface ArrayAndYaml<T> {
    array: T[];
    yaml: string;
}

interface CommonConfig {
    minutesToUsePerDay: number;
    estimates: ArrayAndYaml<EstimateConfig>;
    milestones: ArrayAndYaml<MilestoneConfig>;
    minutesToUsePerSpecificDays: DictAndYaml<number>;
    iconsByProject: DictAndYaml<string>;
    colorsByTaskNameRegexp: DictAndYaml<string>;
}

export default CommonConfig;
export {
    DictAndYaml
}

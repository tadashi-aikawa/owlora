import {Dictionary} from 'lodash';

interface DictAndYaml<T> {
    dict: Dictionary<T>;
    yaml: string;
}

interface CommonConfig {
    todoistToken: string;
    minutesToUsePerDay: number;
    estimatedLabels: DictAndYaml<number>;
    milestoneLabel?: number;
    minutesToUsePerSpecificDays: DictAndYaml<number>;
    iconsByProject: DictAndYaml<string>;
    colorsByTaskNameRegexp: DictAndYaml<string>;
}

export default CommonConfig;
export {
    DictAndYaml
}

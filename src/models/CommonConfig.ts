import {Dictionary} from 'lodash';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';

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
    taskSortField: TaskSortField;
    taskOrder: Order;
}

export default CommonConfig;
export {
    DictAndYaml
}

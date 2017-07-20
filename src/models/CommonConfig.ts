import {Dictionary} from 'lodash';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';

interface CommonConfig {
    todoistToken: string;
    minutesToUsePerDay: number;
    estimatedLabels: Dictionary<number>;
    minutesToUsePerSpecificDays: Dictionary<number>;
    iconsByProject: Dictionary<string>;
    taskSortField: TaskSortField;
    taskOrder: Order;
}

export default CommonConfig;

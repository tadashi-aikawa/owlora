import {Dictionary} from 'lodash';

enum TaskSortField {
    PROJECT_NAME = 'project_name',
    DAY_ORDER = 'day_order',
    TASK_NAME = 'task_name',
    ESTIMATED_MINUTES = 'estimated_minutes',
    START_TIME = 'start_time',
}

module TaskSortField {
    export const toObject: Dictionary<TaskSortField> = {
        [TaskSortField.PROJECT_NAME]: TaskSortField.PROJECT_NAME,
        [TaskSortField.DAY_ORDER]: TaskSortField.DAY_ORDER,
        [TaskSortField.TASK_NAME]: TaskSortField.TASK_NAME,
        [TaskSortField.ESTIMATED_MINUTES]: TaskSortField.ESTIMATED_MINUTES,
        [TaskSortField.START_TIME]: TaskSortField.START_TIME,
    };
}

export default TaskSortField;

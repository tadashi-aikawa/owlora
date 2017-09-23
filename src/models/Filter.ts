import {Dictionary} from 'lodash';
import Task from './Task';


interface Filter {
    iconDisabledMap: Dictionary<boolean>;
}

function createApplier(filter?: Filter): (task: Task) => boolean {
    return (task: Task): boolean => !filter || !filter.iconDisabledMap || !filter.iconDisabledMap[task.icon];
}

export default Filter;
export {
    createApplier
}


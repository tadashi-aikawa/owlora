import {Dictionary} from 'lodash';
import Task from './Task';


interface Filter {
    iconDisabledMap: Dictionary<boolean>;
    word?: string;
}

function createApplier(filter?: Filter): (task: Task) => boolean {
    return (task: Task): boolean => {
        if (!filter) {
            return true;
        }

        return (!filter.iconDisabledMap || !filter.iconDisabledMap[task.icon])
            && (!filter.word || !!task.name.match(new RegExp(filter.word, "i")));
    }
}

export default Filter;
export {
    createApplier
}


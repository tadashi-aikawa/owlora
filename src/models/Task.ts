import {Moment} from 'moment';
import Repetition from '../constants/Repetition';

interface Task {
    id: number;
    name: string;
    projectName: string;
    dueDate: Moment;
    estimatedMinutes: number;
    repetition: Repetition;
    /** URL or emoji(ex. :bow:) */
    icon: string;
    dayOrder: number;
    color: string;
    isMilestone: boolean;
}

interface TaskUpdateParameter {
    id: number;
    name: string;
    dueDate?: Moment;
    dateString?: string;
}

export default Task;
export {
    TaskUpdateParameter
}

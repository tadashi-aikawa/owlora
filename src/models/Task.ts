import {Moment} from 'moment';
import Repetition from '../constants/Repetition';
import Size from '../constants/Size';

interface Task {
    id: number;
    name: string;
    projectName: string;
    dueDate: Moment;
    /* 0 means undefined */
    estimatedMinutes: number;
    time?: {
        start: Moment;
        end: Moment;
    },
    repetition: Repetition;
    /** URL or emoji(ex. :bow:) */
    icon: string;
    dayOrder: number;
    color?: string;
    milestoneColor?: string;
    sealColor?: string;
    isMilestone: boolean;
    isSeal: boolean;
    size: Size;
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

import {Moment} from 'moment';
import Size from '../constants/Size';
import {Repetition} from "./Repetition";

interface Task {
    id: number;
    name: string;
    projectName: string;
    dueDate?: Moment;
    /* 0 means undefined */
    estimatedMinutes: number;
    time?: {
        start: Moment;
        end: Moment;
    },
    repetition: Repetition | undefined;
    /** URL or emoji(ex. :bow:) */
    icon: string;
    itemOrder: number;
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

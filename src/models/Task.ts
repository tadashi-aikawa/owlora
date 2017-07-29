import {Moment} from 'moment';

interface Task {
    id: number;
    name: string;
    projectName: string;
    dueDate: Moment;
    estimatedMinutes: number;
    dateString: string;
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

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
    isMilestone: boolean;
}

interface TaskUpdateParameter {
    id: number;
    name: string;
    dueDate?: Moment;
}

export default Task;
export {
    TaskUpdateParameter
}

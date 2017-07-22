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

export default Task;

import {Moment} from 'moment';

interface Task {
    id: number;
    name: string;
    projectName: string;
    dueDate: Moment;
    elapsedMinutes: number;
    dateString: string;
}

export default Task;

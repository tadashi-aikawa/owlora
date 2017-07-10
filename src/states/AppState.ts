import Task from '../models/Task';

export interface AppState {
    tasks: Task[];
    isTaskLoading: boolean;
    todoistToken: string;
}

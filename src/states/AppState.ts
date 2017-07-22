import Task from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';

export interface AppState {
    tasks: Task[];
    projects: Project[];
    labels: Label[];
    error?: Error;
    isSyncing: boolean;
}

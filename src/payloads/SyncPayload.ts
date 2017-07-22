import Task from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';

interface SyncPayload {
    tasks: Task[];
    projects: Project[];
    labels: Label[];
}

export default SyncPayload;

import Task from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';

interface FetchTodoist {
    tasks: Task[];
    projects: Project[];
    labels: Label[];
}

export default FetchTodoist;

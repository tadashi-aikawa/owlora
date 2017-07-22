import Task from '../models/Task';
import Project from '../models/Project';

interface FetchTodoist {
    tasks: Task[];
    projects: Project[];
}

export default FetchTodoist;

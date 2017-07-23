import Task from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';
import {Dictionary} from 'lodash';

interface SyncPayload {
    tasksById: Dictionary<Task>;
    projects: Project[];
    labels: Label[];
}

export default SyncPayload;

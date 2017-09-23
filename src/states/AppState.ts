import Task from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';
import {Dictionary} from 'lodash';
import Filter from '../models/Filter';

export interface AppState {
    tasksById: Dictionary<Task>;
    projects: Project[];
    labels: Label[];
    error?: Error;
    isSyncing: boolean;
    guardSyncing: boolean;
    filter: Filter;
}

import Task from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';
import {Dictionary} from 'lodash';
import CardAppearance from '../constants/CardAppearance';

export interface AppState {
    tasksById: Dictionary<Task>;
    projects: Project[];
    labels: Label[];
    error?: Error;
    isSyncing: boolean;
    cardAppearance: CardAppearance;
    isIceboxVisible: boolean;
}

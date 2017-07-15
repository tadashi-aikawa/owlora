import Task from '../models/Task';
import {Dictionary} from "lodash";

export interface AppState {
    tasks: Task[];
    estimatedLabels: Dictionary<number>;
    isTaskLoading: boolean;
    todoistToken: string;
}

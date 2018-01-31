import { default as Task, TaskUpdateParameter } from "../models/Task";
import SyncPayload from "../payloads/SyncPayload";
import { Dictionary } from "lodash";
import { CommonConfigValue } from "../models/CommonConfig";
import TodoistAll from '../models/todoist/TodoistALl';

interface SyncService {
    ping(token: string): Promise<TodoistAll>;
    sync(token: string, config: CommonConfigValue): Promise<SyncPayload>;
    updateTasks(
        token: string,
        taskUpdateParameters: TaskUpdateParameter[],
        config: CommonConfigValue
    ): Promise<Dictionary<Task>>;
    removeTasks(token: string, ids: number[], config: CommonConfigValue): Promise<Dictionary<Task>>;
}

export default SyncService;

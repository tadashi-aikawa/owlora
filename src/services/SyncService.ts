import {default as Task, TaskUpdateParameter} from '../models/Task';
import SyncPayload from '../payloads/SyncPayload';
import {Dictionary} from 'lodash';

interface SyncService {
    ping(token: string);
    sync(token?: string): IterableIterator<any | SyncPayload>;
    updateTasks(taskUpdateParameters: TaskUpdateParameter[]): IterableIterator<any | Dictionary<Task>>;
}

export default SyncService

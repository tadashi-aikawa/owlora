import {TaskUpdateParameter} from '../models/Task';

interface SyncService {
    sync();
    updateTasks(taskUpdateParameters: TaskUpdateParameter[]);
}

export default SyncService

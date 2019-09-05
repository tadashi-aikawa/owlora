import Axios from 'axios';
import {stringify} from 'query-string';
import TodoistAll from '../models/todoist/TodoistALl';
import * as udvi4u from 'uuid/v4';

const baseURL = 'https://todoist.com/API/v8/';

const dueDateUtcReplacer = (key, value) =>
    (key === 'due_date_utc' && value === '') ? null : value;

export interface UpdateArgs {
    id: number;
    due_date_utc?: string;
    date_string?: string;
}

export interface DeleteArgs {
    ids: number[];
}

interface Command {
    type: string;
    uuid: string;
    args: UpdateArgs | DeleteArgs;
}

function sync(token: string, resourceTypes: string[], commands?: Command[]): Promise<TodoistAll> {
    return Axios.post(
        '/sync',
        stringify({
            token,
            sync_token: '*',
            resource_types: JSON.stringify(resourceTypes),
            commands: JSON.stringify(commands, dueDateUtcReplacer)
        }),
        {baseURL}
    ).then((r: any) => r.data);
}

const updateTasks = (token: string, argsList: UpdateArgs[]) =>
    // TODO: Remove projects
    sync(token, ['items', 'projects'], argsList.map(x => ({
        type: "item_update",
        uuid: udvi4u(),
        args: x
    })));

const removeTasks = (token: string, ids: number[]) =>
    sync(token, ['items', 'projects'], [{
        type: "item_delete",
        uuid: udvi4u(),
        args: {ids}
    }]);

const fetchAll = (token: string): Promise<TodoistAll> =>
    sync(token, ['labels', 'projects', 'items']);

export {
    updateTasks,
    removeTasks,
    fetchAll,
}

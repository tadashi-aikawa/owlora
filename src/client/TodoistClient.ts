import Axios from 'axios';
import {stringify} from 'query-string';
import TodoistAll from '../models/todoist/TodoistALl';
import * as udvi4u from 'uuid/v4';

const baseURL = 'https://todoist.com/API/v7/';

const decorateDoubleQuote = (v: string) => `"${v}"`;

interface Command {
    type: string;
    uuid: string;
    args: {
        id: number;
        due_date_utc: string;
    };
}

async function sync(token: string, resourceTypes: string[], command?: Command): Promise<TodoistAll> {
    return await Axios.post(
        '/sync',
        stringify({
            token,
            sync_token: '*',
            resource_types: JSON.stringify(resourceTypes),
            commands: JSON.stringify(command)
        }),
        {baseURL}
    ).then((r: any) => r.data);
}

const updateTasks = async (token: string, args: any) =>
    // TODO: Remove projects
    await sync(token, ['items', 'projects'], args.map(x => ({
        type: "item_update",
        uuid: udvi4u(),
        args: x
    })));

const fetchAll = async (token: string): Promise<TodoistAll> =>
    await sync(token, ['labels', 'projects', 'items']);

export {
    updateTasks,
    fetchAll,
}

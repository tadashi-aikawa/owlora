import Axios from 'axios';
import {stringify} from 'query-string';
import TodoistAll from '../models/todoist/TodoistALl';

const baseURL = 'https://todoist.com/API/v7/';

const decorateDoubleQuote = (v: string) => `"${v}"`;

async function sync(token: string, resourceTypes: string[]): Promise<TodoistAll> {
    return await Axios.post(
        '/sync',
        stringify({
            token,
            sync_token: '*',
            resource_types: `[${resourceTypes.map(decorateDoubleQuote).join(',')}]`
        }),
        {baseURL}
    ).then((r: any) => r.data);
}

const fetchAll = async (token: string): Promise<TodoistAll> =>
    await sync(token, ['labels', 'projects', 'items']);

export {
    fetchAll,
}

import Axios from 'axios';
import {stringify} from 'query-string';
import TodoistProject from '../models/todoist/TodoistProject';
import TodoistTask from '../models/todoist/TodoistTask';
import TodoistLabel from '../models/todoist/TodoistLabel';

const baseURL = 'https://todoist.com/API/v7/';

async function sync<T>(token: string, resourceType: string): Promise<T> {
    return await Axios.post(
        '/sync',
        stringify({
            token,
            sync_token: '*',
            resource_types: `["${resourceType}"]`
        }),
        {baseURL}
    ).then((r: any) => r.data[resourceType] as T);
}

const fetchTasks = async (token: string): Promise<TodoistTask[]> =>
    await sync<TodoistTask[]>(token, 'items');

const fetchProjects = async (token: string): Promise<TodoistProject[]> =>
    await sync<TodoistProject[]>(token, 'projects');

const fetchLabels = async (token: string): Promise<TodoistLabel[]> =>
    await sync<TodoistLabel[]>(token, 'labels');

export {
    fetchTasks,
    fetchProjects,
    fetchLabels
}

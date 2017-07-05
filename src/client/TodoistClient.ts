import Axios from 'axios';
import {stringify} from 'query-string';
import Project from '../models/todoist/Project';
import TodoistTask from '../models/todoist/TodoistTask';

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

const fetchProjects = async (token: string): Promise<Project[]> =>
    await sync<Project[]>(token, 'projects');

export {
    fetchTasks,
    fetchProjects
}

/**
 * {@link https://developer.todoist.com/?shell#items}
 */
import TodoistLabel from './TodoistLabel';
import TodoistProject from './TodoistProject';
import TodoistTask from './TodoistTask';
import {Dictionary} from "lodash";

interface TodoistAll {
    sync_status?: Dictionary<string>,
    labels?: TodoistLabel[],
    projects?: TodoistProject[],
    items?: TodoistTask[],
}

export default TodoistAll;

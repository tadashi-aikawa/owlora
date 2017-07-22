/**
 * {@link https://developer.todoist.com/?shell#items}
 */
import TodoistLabel from './TodoistLabel';
import TodoistProject from './TodoistProject';
import TodoistTask from './TodoistTask';

interface TodoistAll {
    labels?: TodoistLabel[],
    projects?: TodoistProject[],
    items?: TodoistTask[],
}

export default TodoistAll;

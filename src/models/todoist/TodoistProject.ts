/**
 * Projects from Todoist API
 * {@link https://developer.todoist.com/?shell#items}
 */
interface TodoistProject {
    id: number;
    name: string;
    indent: number;
    color: number;
    is_deleted: number;
    collapsed: number;
    inbox_project: boolean;
    parent_id: number;
    item_order: number;
    is_archived: number;
    shared: boolean;
}

export default TodoistProject;

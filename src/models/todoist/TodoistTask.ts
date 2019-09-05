/**
 * Tasks from Todoist API
 * {@link https://developer.todoist.com/?shell#items}
 */
interface Due {
    date: string
    is_recurring: boolean
    lang: string
    string: string
}

interface TodoistTask {
    id: number;
    user_id: number;
    project_id: number;
    content: string;
    /** ex. (Mon 07 Aug 2006 12:34:56 +0000) */
    due: Due | null;
    /** 1 to 4 */
    indent: number;
    /** 1 to 4 */
    priority: number;
    item_order: number;
    day_order: number;
    collapsed: number;
    labels: number[];
    assigned_by_uid: number;
    responsible_uid: number;
    checked: number;
    in_history: number;
    is_deleted: number;
    is_archived: number;
    sync_id: number;
    /** ex. (Mon 07 Aug 2006 12:34:56 +0000) */
    date_added: string;
}

export default TodoistTask;

import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import * as moment from 'moment';
import * as TodoistClient from '../client/TodoistClient';
import {
    estimatedLabelsSelector, iconsByProjectSelector, milestoneLabelSelector,
    todoistTokenSelector
} from '../reducers/selectors';
import {call, select} from 'redux-saga/effects';
import TodoistAll from '../models/todoist/TodoistALl';
import TodoistProject from '../models/todoist/TodoistProject';
import Task, {TaskUpdateParameter} from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';
import SyncService from './SyncService';
import TodoistTask from '../models/todoist/TodoistTask';


function *todoistTasksToTasks(todoistTasks: TodoistTask[], projects: TodoistProject[]) {
    // This method returns SyncPayload
    // TODO: Argument TodoistProject[] have to be removed
    const estimatedLabels: Dictionary<number> = yield select(estimatedLabelsSelector);
    const milestoneLabel: number = yield select(milestoneLabelSelector);
    const iconsByProject: Dictionary<string> = yield select(iconsByProjectSelector);

    const projectsById: Dictionary<TodoistProject> = _.keyBy(projects, p => p.id);

    return yield _(todoistTasks)
        .filter(x =>
            !x.checked &&
            x.due_date_utc &&
            x.labels.some(l => l in estimatedLabels || l === milestoneLabel)
        )
        .orderBy(x => x.project_id)
        .map(x => ({
            id: x.id,
            name: x.content,
            projectName: projectsById[String(x.project_id)].name,
            estimatedMinutes: _.find(estimatedLabels, (v, k) => _.includes(x.labels, Number(k))),
            dueDate: moment(x.due_date_utc),
            dateString: x.date_string,
            icon: iconsByProject[String(x.project_id)],
            dayOrder: x.day_order,
            isMilestone: _.includes(x.labels, milestoneLabel)
        }))
        .value();
}

class TodoistSyncService implements SyncService {
    *sync() {
        const token = yield select(todoistTokenSelector);
        const res: TodoistAll = yield call(TodoistClient.fetchAll, token);

        const tasks: Task[] = yield todoistTasksToTasks(res.items, res.projects);
        const projects: Project[] = res.projects.map(x => x);
        const labels: Label[] = res.labels.map(x => x);

        return yield Promise.resolve({tasks, projects, labels})
    }

    *updateTasks(taskUpdateParameters: TaskUpdateParameter[]) {
        const token = yield select(todoistTokenSelector);
        const res: TodoistAll = yield call(
            TodoistClient.updateTasks,
            token,
            taskUpdateParameters.map(x => ({
                id: x.id,
                due_date_utc: x.dueDate.format('YYYY-MM-DDTHH:mm')
            }))
        );

        const tasks: Task[] = yield todoistTasksToTasks(res.items, res.projects);
        return yield Promise.resolve(tasks);
    }
}

export default TodoistSyncService

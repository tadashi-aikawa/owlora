import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import * as moment from 'moment';
import * as TodoistClient from '../client/TodoistClient';
import {
    colorsByTaskNameRegexpSelector,
    estimatedLabelsSelector,
    iconsByProjectSelector,
    milestoneLabelSelector,
    todoistTokenSelector,
} from '../reducers/selectors';
import {call, select} from 'redux-saga/effects';
import TodoistAll from '../models/todoist/TodoistALl';
import TodoistProject from '../models/todoist/TodoistProject';
import Task, {TaskUpdateParameter} from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';
import SyncService from './SyncService';
import TodoistTask from '../models/todoist/TodoistTask';


function* todoistTasksToTasks(todoistTasks: TodoistTask[], projects: TodoistProject[]) {
    // This method returns Dictionary<Task>
    // TODO: Argument TodoistProject[] have to be removed
    const estimatedLabels: Dictionary<number> = yield select(estimatedLabelsSelector);
    const milestoneLabel: number = yield select(milestoneLabelSelector);
    const iconsByProject: Dictionary<string> = yield select(iconsByProjectSelector);
    const colorsByTaskNameRegexp: Dictionary<string> = Object.assign(
        yield select(colorsByTaskNameRegexpSelector),
        {'.*': 'rgba(200, 200, 200, 0.1)'}
    );

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
            isMilestone: _.includes(x.labels, milestoneLabel),
            color: _.find(colorsByTaskNameRegexp, (v, k) => !!x.content.match(new RegExp(k))),
        }))
        .keyBy(x => x.id)
        .value();
}

class TodoistSyncService implements SyncService {
    * sync() {
        const token = yield select(todoistTokenSelector);
        const res: TodoistAll = yield call(TodoistClient.fetchAll, token);

        const tasksById: Dictionary<Task> = yield todoistTasksToTasks(res.items, res.projects);
        const projects: Project[] = res.projects.map(x => x);
        const labels: Label[] = res.labels.map(x => x);

        return yield Promise.resolve({tasksById, projects, labels})
    }

    * updateTasks(taskUpdateParameters: TaskUpdateParameter[]) {
        const token = yield select(todoistTokenSelector);
        const res: TodoistAll = yield call(
            TodoistClient.updateTasks,
            token,
            taskUpdateParameters.map(x => ({
                id: x.id,
                due_date_utc: x.dueDate.format('YYYY-MM-DDTHH:mm')
            }))
        );

        const tasksById: Dictionary<Task> = yield todoistTasksToTasks(res.items, res.projects);
        return yield Promise.resolve(tasksById);
    }
}

export default TodoistSyncService

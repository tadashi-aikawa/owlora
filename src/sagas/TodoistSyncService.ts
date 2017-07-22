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
import Task from '../models/Task';
import Project from '../models/Project';
import Label from '../models/Label';
import SyncService from './SyncService';

class TodoistSyncService implements SyncService {
    *sync() {
        const token = yield select(todoistTokenSelector);
        const res: TodoistAll = yield call(TodoistClient.fetchAll, token);

        const estimatedLabels: Dictionary<number> = yield select(estimatedLabelsSelector);
        const milestoneLabel: number = yield select(milestoneLabelSelector);
        const iconsByProject: Dictionary<string> = yield select(iconsByProjectSelector);

        const projectsById: Dictionary<TodoistProject> = _.keyBy(res.projects, p => p.id);
        const tasks: Task[] = _(res.items)
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
        const projects: Project[] = res.projects.map(x => x);
        const labels: Label[] = res.labels.map(x => x);

        return yield Promise.resolve({tasks, projects, labels})
    }
}

export default TodoistSyncService

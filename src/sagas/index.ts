import {call, fork, put, select, take} from 'redux-saga/effects';
import * as actions from '../actions';
import * as TodoistClient from '../client/TodoistClient';
import {estimatedLabelsSelector, iconsByProjectSelector, todoistTokenSelector} from '../reducers/selectors';
import Task from '../models/Task';
import TodoistProject from '../models/todoist/TodoistProject';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import * as moment from 'moment';
import TodoistAll from '../models/todoist/TodoistALl';
import Project from '../models/Project';
import Label from '../models/Label';

// TODO: Move to reducer

export function* fetchTasks(token: string) {
    // TODO: Add failure case
    const res: TodoistAll = yield call(TodoistClient.fetchAll, token);

    const estimatedLabels: Dictionary<number> = yield select(estimatedLabelsSelector);
    const iconsByProject: Dictionary<string> = yield select(iconsByProjectSelector);

    const projectsById: Dictionary<TodoistProject> = _.keyBy(res.projects, p => p.id);
    const tasks: Task[] = _(res.items)
        .filter(x => !x.checked && x.due_date_utc && x.labels.some(l => l in estimatedLabels))
        .orderBy(x => x.project_id)
        .map(x => ({
            id: x.id,
            name: x.content,
            projectName: projectsById[String(x.project_id)].name,
            estimatedMinutes: _.find(estimatedLabels, (v, k) => _.includes(x.labels, Number(k))),
            dueDate: moment(x.due_date_utc),
            dateString: x.date_string,
            iconUrl: iconsByProject[String(x.project_id)],
            dayOrder: x.day_order,
        }))
        .value();
    const projects: Project[] = res.projects.map(x => x);
    const labels: Label[] = res.labels.map(x => x);

    yield put(actions.successFetchTodoist(tasks, projects, labels));
}

function* loadTasks() {
    while (true) {
        yield take(actions.FETCH_TODOIST);
        const token = yield select(todoistTokenSelector);
        yield call(fetchTasks, token);
    }
}

export default function* () {
    yield fork(loadTasks);
}

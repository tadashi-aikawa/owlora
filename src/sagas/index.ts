import {take, put, call, fork, select, takeEvery} from 'redux-saga/effects';
import * as actions from '../actions'
import * as TodoistClient from '../client/TodoistClient';
import {todoistTokenSelector} from "../reducers/selectors";
import Task from '../models/Task';
import Project from '../models/todoist/Project';
import TodoistTask from '../models/todoist/TodoistTask';
import {Dictionary} from "lodash";
import * as _ from "lodash";
import * as moment from "moment";
// TODO: Move to reducer
import {ESTIMATED_LABELS} from '../storage/settings';

export function* fetchTasks(token: string) {
    // TODO: Add failure case
    const todoistTasks: TodoistTask[] = yield call(TodoistClient.fetchTasks, token);
    const projects: Project[] = yield call(TodoistClient.fetchProjects, token);

    const projectsById: Dictionary<Project> = _.keyBy(projects, p => p.id);
    const tasks: Task[] = _(todoistTasks)
        .filter(x => !x.checked && x.due_date_utc && x.labels.some(l => l in ESTIMATED_LABELS))
        .orderBy(x => x.project_id)
        .map(x => ({
            id: x.id,
            name: x.content,
            projectName: projectsById[String(x.project_id)].name,
            elapsedMinutes: _.find(ESTIMATED_LABELS, (v, k) => _.includes(x.labels, Number(k))),
            dueDate: moment(x.due_date_utc),
            dateString: x.date_string
        }))
        .value();

    yield put(actions.successFetchTasks(tasks));
}

function* loadTasks() {
    while(true) {
        yield take(actions.FETCH_TASKS);
        const token = yield select(todoistTokenSelector);
        yield call(fetchTasks, token);
    }
}

export default function* root() {
    yield fork(loadTasks);
}

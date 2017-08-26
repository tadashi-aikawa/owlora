import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import * as moment from 'moment';
import * as TodoistClient from '../client/TodoistClient';
import {
    colorsByTaskNameRegexpSelector,
    estimatedLabelsSelector,
    iconsByProjectSelector,
    milestonesSelector,
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
import SyncPayload from '../payloads/SyncPayload';
import Repetition from '../constants/Repetition';
import MilestoneConfig from '../models/MilestoneConfig';
import Size from '../constants/Size';

const toRepetition = (dateString: string): Repetition => {
    if (!dateString) {
        return null;
    }

    const mappings = [
        {predicate: x => x === '毎日', repetition: Repetition.EVERY_DAY},
        {predicate: x => x === '平日', repetition: Repetition.WEEKDAY},
        {predicate: x => x.startsWith('毎週月曜'), repetition: Repetition.EVERY_MONDAY},
        {predicate: x => x.startsWith('毎週火曜'), repetition: Repetition.EVERY_TUESDAY},
        {predicate: x => x.startsWith('毎週水曜'), repetition: Repetition.EVERY_WEDNESDAY},
        {predicate: x => x.startsWith('毎週木曜'), repetition: Repetition.EVERY_THURSDAY},
        {predicate: x => x.startsWith('毎週金曜'), repetition: Repetition.EVERY_FRIDAY},
    ];

    const found = _.find(mappings, m => m.predicate(dateString));
    return found && found.repetition;
};


function* todoistTasksToTasks(todoistTasks: TodoistTask[], projects: TodoistProject[]): IterableIterator<any | Dictionary<Task>> {
    // This method returns Dictionary<Task>
    // TODO: Argument TodoistProject[] have to be removed
    const estimatedLabels: Dictionary<number> = yield select(estimatedLabelsSelector);
    const milestones: MilestoneConfig[] = yield select(milestonesSelector);
    const iconsByProject: Dictionary<string> = yield select(iconsByProjectSelector);
    const colorsByTaskNameRegexp: Dictionary<string> = Object.assign(
        yield select(colorsByTaskNameRegexpSelector),
        {'.*': 'rgba(200, 200, 200, 0.1)'}
    );

    const projectsById: Dictionary<TodoistProject> = _.keyBy(projects, p => p.id);

    return _(todoistTasks)
        .filter(x => !x.checked)
        .orderBy(x => x.project_id)
        .map(x => {
            const matched: MilestoneConfig = _.find(
                milestones,
                (m: MilestoneConfig) => _.every([
                    !m.condition.regexp || x.content.match(new RegExp(m.condition.regexp)),
                    !m.condition.labelIdsOr || _.intersection(x.labels, m.condition.labelIdsOr).length > 0,
                    !m.condition.projectIdsOr || _.includes(m.condition.projectIdsOr, x.project_id)
                ])
            );
            const times = x.content.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);

            return {
                id: x.id,
                name: x.content,
                projectName: projectsById[String(x.project_id)].name,
                estimatedMinutes: _.find(estimatedLabels, (v, k) => _.includes(x.labels, Number(k))),
                dueDate: x.due_date_utc && moment(x.due_date_utc),
                time: times && {
                    start: moment(x.due_date_utc).hour(Number(times[1])).minute(Number(times[2])),
                    end: moment(x.due_date_utc).hour(Number(times[3])).minute(Number(times[4])),
                },
                repetition: toRepetition(x.date_string),
                icon: iconsByProject[String(x.project_id)] || ":white_circle:",
                dayOrder: x.day_order,
                isMilestone: !!matched,
                color: !!matched ? matched.color :
                    _.find(colorsByTaskNameRegexp, (v, k) => !!x.content.match(new RegExp(k))),
                size: !!matched ? (matched.size || Size.SMALL) : Size.SMALL,
            }
        })
        .filter(x => x.estimatedMinutes || x.isMilestone)
        .keyBy(x => x.id)
        .value();
}

class TodoistSyncService implements SyncService {
    * sync(): IterableIterator<any | SyncPayload> {
        const token = yield select(todoistTokenSelector);
        const res: TodoistAll = yield call(TodoistClient.fetchAll, token);

        const tasksById: Dictionary<Task> = yield todoistTasksToTasks(res.items, res.projects);
        const projects: Project[] = res.projects.map(x => x);
        const labels: Label[] = res.labels.map(x => x);

        return {tasksById, projects, labels}
    }

    * updateTasks(taskUpdateParameters: TaskUpdateParameter[]): IterableIterator<any | Dictionary<Task>> {
        const token = yield select(todoistTokenSelector);
        const res: TodoistAll = yield call(
            TodoistClient.updateTasks,
            token,
            taskUpdateParameters.map(x => ({
                id: x.id,
                due_date_utc: x.dueDate && x.dueDate.hour(23).minute(59).second(59).utc().format('YYYY-M-DDTHH:mm:ss'),
                date_string: x.dateString
            }))
        );

        return yield todoistTasksToTasks(res.items, res.projects);
    }
}

export default TodoistSyncService

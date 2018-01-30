import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import * as moment from 'moment';
import * as TodoistClient from '../client/TodoistClient';
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
import EstimateConfig from '../models/EstimateConfig';
import SealConfig from '../models/SealConfig';
import {CommonConfigValue} from '../models/CommonConfig';

const toRepetition = (dateString: string): Repetition | undefined => {
    if (!dateString) {
        return undefined;
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


function convertToTasks(todoistTasks: TodoistTask[], projects: TodoistProject[], config: CommonConfigValue): Dictionary<Task> {
    return _(todoistTasks)
        .filter<TodoistTask>(x => !x.checked)
        .orderBy<TodoistTask>(x => x.project_id)
        .map<TodoistTask, Task>((x: TodoistTask) => {
            const matchedMilestone: MilestoneConfig | undefined = _.find(
                config.milestones,
                (m: MilestoneConfig) => _.every([
                    !m.condition.regexp || x.content.match(new RegExp(m.condition.regexp)),
                    !m.condition.labelIdsOr || _.intersection(x.labels, m.condition.labelIdsOr).length > 0,
                    !m.condition.projectIdsOr || _.includes(m.condition.projectIdsOr, x.project_id)
                ])
            );
            const matchedSeal: SealConfig | undefined = _.find(
                config.seals,
                (l: SealConfig) => _.every([
                    !l.condition.regexp || x.content.match(new RegExp(l.condition.regexp)),
                    !l.condition.labelIdsOr || _.intersection(x.labels, l.condition.labelIdsOr).length > 0,
                    !l.condition.projectIdsOr || _.includes(l.condition.projectIdsOr, x.project_id)
                ])
            );
            const matchedEstimate: EstimateConfig | undefined = _.find(
                config.estimates,
                (e: EstimateConfig) => _.every([
                    !e.condition.regexp || x.content.match(new RegExp(e.condition.regexp)),
                    !e.condition.labelId || _.includes(x.labels, e.condition.labelId),
                    !e.condition.projectId || x.project_id === e.condition.projectId,
                ])
            );

            const times = x.content.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);

            return {
                id: x.id,
                name: x.content,
                projectName: _.keyBy(projects, p => p.id)[String(x.project_id)].name,
                estimatedMinutes: matchedEstimate && (matchedEstimate.minutes || 0),
                dueDate: x.due_date_utc && moment(x.due_date_utc),
                time: times && {
                    start: moment(x.due_date_utc).hour(Number(times[1])).minute(Number(times[2])),
                    end: moment(x.due_date_utc).hour(Number(times[3])).minute(Number(times[4])),
                },
                repetition: toRepetition(x.date_string),
                icon: config.iconsByProject[String(x.project_id)] || ":white_circle:",
                itemOrder: x.item_order,
                dayOrder: x.day_order,
                isMilestone: !!matchedMilestone,
                isSeal: !!matchedSeal,
                color: _.find(config.colorsByTaskNameRegexp, (v, k) => !!x.content.match(new RegExp(k))),
                milestoneColor: matchedMilestone && matchedMilestone.color,
                sealColor: matchedSeal && matchedSeal.color,
                size: !!matchedMilestone ? (matchedMilestone.size || Size.SMALL) : Size.SMALL,
            }
        })
        .filter<Task>(x => x.estimatedMinutes !== undefined || x.isMilestone || x.isSeal)
        .keyBy(x => x.id)
        .value();
}

class TodoistSyncService implements SyncService {
    ping(token: string): Promise<TodoistAll> {
        return TodoistClient.fetchAll(token);
    }

    async sync(token: string, config: CommonConfigValue): Promise<SyncPayload> {
        const res: TodoistAll = await TodoistClient.fetchAll(token);

        const tasksById: Dictionary<Task> = convertToTasks(res.items, res.projects, config);
        const projects: Project[] = res.projects.map(x => x);
        const labels: Label[] = res.labels.map(x => x);

        return {tasksById, projects, labels}
    }

    async updateTasks(token: string, taskUpdateParameters: TaskUpdateParameter[], config: CommonConfigValue): Promise<Dictionary<Task>> {
        const res: TodoistAll = await TodoistClient.updateTasks(
            token,
            taskUpdateParameters.map(x => ({
                id: x.id,
                due_date_utc: x.dueDate && x.dueDate.hour(23).minute(59).second(59).utc().format('YYYY-M-DDTHH:mm:ss'),
                date_string: x.dateString
            }))
        );
        return convertToTasks(res.items, res.projects, config);
    }
}

export default TodoistSyncService

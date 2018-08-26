import * as _ from "lodash"
import { Dictionary } from "lodash"
import * as moment from "moment"
import { Moment } from "moment"
import * as TodoistClient from "../client/TodoistClient"
import TodoistAll from "../models/todoist/TodoistALl"
import TodoistProject from "../models/todoist/TodoistProject"
import Task, { TaskUpdateParameter } from "../models/Task"
import Project from "../models/Project"
import Label from "../models/Label"
import SyncService from "./SyncService"
import TodoistTask from "../models/todoist/TodoistTask"
import SyncPayload from "../payloads/SyncPayload"
import MilestoneConfig from "../models/MilestoneConfig"
import Size from "../constants/Size"
import EstimateConfig from "../models/EstimateConfig"
import SealConfig from "../models/SealConfig"
import { CommonConfigValue } from "../models/CommonConfig"
import { Pattern, Repetition } from "../models/Repetition"
import { match, isNaturalNumber } from "../utils/RegExpUtil"

const WEEK_MAPPINGS: Dictionary<number> = {
    "1": 1,
    "1st": 1,
    "1th": 1,
    "2": 2,
    "2st": 2,
    "2th": 2,
    "3": 3,
    "3st": 3,
    "3th": 3,
    "4": 4,
    "4st": 4,
    "4th": 4,
}

const DAY_OF_WEEK_MAPPINGS: Dictionary<number> = {
    sun: 0,
    sunday: 0,
    mon: 1,
    monday: 1,
    tue: 2,
    tuesday: 2,
    wed: 3,
    wednesday: 3,
    thu: 4,
    thursday: 4,
    fri: 5,
    friday: 5,
    sat: 6,
    saturday: 6,
}

const toDaysOfWeek = (daysOfWeekStr: string): number[] =>
    daysOfWeekStr
        .split(",")
        .map(x => DAY_OF_WEEK_MAPPINGS[x.trim().replace(/s$/, "")])
        .filter(x => x !== undefined)

// ex. weekStr = 1st
const toWeek = (weekStr: string): number[] =>
    weekStr
        .split(",")
        .map(x => WEEK_MAPPINGS[x.trim()])
        .filter(x => x !== undefined)

const toRepetition = (dateString: string, content: string): Repetition | undefined => {
    if (!dateString) {
        return undefined
    }

    const q: string[] = dateString
        .replace(", ", ",")
        .toLowerCase()
        .split(" ")

    if (q[0] !== "every") {
        return undefined
    }

    const datesExcepted: Moment[] = [
        ...(content.match(/x\d{4}\/\d{1,2}\/\d{1,2}/g) || []).map(x => moment(x, "YYYY/M/D")),
        ...(content.match(/x\d{1,2}\/\d{1,2}/g) || []).map(x => moment(x, "M/D")),
    ]

    const lastDate: Moment = (dateString.match(/ending \d{4}-\d{2}-\d{2}/g) || []).map(x => moment(x, "YYYY-MM-DD"))[0]

    // "every" or "every other" ??
    q.shift()
    let pattern: Pattern = "every"

    if (q[0] === "other") {
        pattern = "every other"
        q.shift()
    }

    // weeks
    // TODO: Refactoring this method...
    if (match(q[0], "[1-5](st|nd|rd|th|)") && match(q[1], "[a-zA-Z]+")) {
        return Repetition.fromDaysOfWeek(toDaysOfWeek(q[1]), toWeek(q[0]), pattern)
            .addDatesExcepted(datesExcepted)
            .addLastDate(lastDate)
    }

    if (match(q[0], "days?")) {
        return Repetition.everyDay.addDatesExcepted(datesExcepted).addLastDate(lastDate)
    }

    if (match(q[0], "workdays?")) {
        return Repetition.everyWeekDay.addDatesExcepted(datesExcepted).addLastDate(lastDate)
    }

    // days
    if (q[0].split(",").every(isNaturalNumber)) {
        const days: number[] = q[0].split(",").map(x => Number(x))
        return Repetition.fromDays(days, pattern)
            .addDatesExcepted(datesExcepted)
            .addLastDate(lastDate)
    }

    // TODO: Fix when implementing more feature..
    const daysOfWeek: number[] = toDaysOfWeek(q[0])
    if (daysOfWeek.length > 0) {
        return Repetition.fromDaysOfWeek(daysOfWeek, pattern)
            .addDatesExcepted(datesExcepted)
            .addLastDate(lastDate)
    }

    console.warn("Unsupported pattern!!")
    return undefined
}

function convertToTasks(
    todoistTasks: TodoistTask[],
    projects: TodoistProject[],
    config: CommonConfigValue
): Dictionary<Task> {
    return _(todoistTasks)
        .filter<TodoistTask>(x => !x.checked)
        .orderBy<TodoistTask>(x => x.project_id)
        .map<TodoistTask, Task>((x: TodoistTask) => {
            const matchedMilestone: MilestoneConfig | undefined = _.find(config.milestones, (m: MilestoneConfig) =>
                _.every([
                    !m.condition.regexp || x.content.match(new RegExp(m.condition.regexp)),
                    !m.condition.labelIdsOr || _.intersection(x.labels, m.condition.labelIdsOr).length > 0,
                    !m.condition.projectIdsOr || _.includes(m.condition.projectIdsOr, x.project_id),
                ])
            )
            const matchedSeal: SealConfig | undefined = _.find(config.seals, (l: SealConfig) =>
                _.every([
                    !l.condition.regexp || x.content.match(new RegExp(l.condition.regexp)),
                    !l.condition.labelIdsOr || _.intersection(x.labels, l.condition.labelIdsOr).length > 0,
                    !l.condition.projectIdsOr || _.includes(l.condition.projectIdsOr, x.project_id),
                ])
            )
            const matchedEstimate: EstimateConfig | undefined = _.find(config.estimates, (e: EstimateConfig) =>
                _.every([
                    !e.condition.regexp || x.content.match(new RegExp(e.condition.regexp)),
                    !e.condition.labelId || _.includes(x.labels, e.condition.labelId),
                    !e.condition.projectId || x.project_id === e.condition.projectId,
                ])
            )

            const times = x.content.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/)

            return {
                id: x.id,
                name: x.content,
                projectName: _.keyBy(projects, p => p.id)[String(x.project_id)].name,
                estimatedMinutes: matchedEstimate && (matchedEstimate.minutes || 0),
                dueDate: x.due_date_utc && moment(x.due_date_utc),
                time: times && {
                    start: moment(x.due_date_utc)
                        .hour(Number(times[1]))
                        .minute(Number(times[2])),
                    end: moment(x.due_date_utc)
                        .hour(Number(times[3]))
                        .minute(Number(times[4])),
                },
                repetition: toRepetition(x.date_string, x.content),
                icon: config.iconsByProject[String(x.project_id)] || ":white_circle:",
                itemOrder: x.item_order,
                dayOrder: x.day_order,
                isMilestone: !!matchedMilestone,
                isSeal: !!matchedSeal,
                color: _.find(config.colorsByTaskNameRegexp, (v, k) => !!x.content.match(new RegExp(k))),
                milestoneColor: matchedMilestone && matchedMilestone.color,
                sealColor: matchedSeal && matchedSeal.color,
                size: !!matchedMilestone ? matchedMilestone.size || Size.SMALL : Size.SMALL,
            }
        })
        .filter<Task>(x => x.estimatedMinutes !== undefined || x.isMilestone || x.isSeal)
        .keyBy(x => x.id)
        .value()
}

class TodoistSyncService implements SyncService {
    ping(token: string): Promise<TodoistAll> {
        return TodoistClient.fetchAll(token)
    }

    async sync(token: string, config: CommonConfigValue): Promise<SyncPayload> {
        const res: TodoistAll = await TodoistClient.fetchAll(token)

        const tasksById: Dictionary<Task> = convertToTasks(res.items, res.projects, config)
        const projects: Project[] = res.projects.map(x => x)
        const labels: Label[] = res.labels.map(x => x)

        return { tasksById, projects, labels }
    }

    async updateTasks(
        token: string,
        taskUpdateParameters: TaskUpdateParameter[],
        config: CommonConfigValue
    ): Promise<Dictionary<Task>> {
        const res: TodoistAll = await TodoistClient.updateTasks(
            token,
            taskUpdateParameters.map(x => ({
                id: x.id,
                due_date_utc:
                    x.dueDate &&
                    x.dueDate
                        .hour(23)
                        .minute(59)
                        .second(59)
                        .utc()
                        .format("YYYY-M-DDTHH:mm:ss"),
                date_string: x.dateString,
            }))
        )
        return convertToTasks(res.items, res.projects, config)
    }

    async removeTasks(token: string, ids: number[], config: CommonConfigValue): Promise<Dictionary<Task>> {
        const res: TodoistAll = await TodoistClient.removeTasks(token, ids)
        return convertToTasks(res.items, res.projects, config)
    }
}

export default TodoistSyncService
export { toRepetition }

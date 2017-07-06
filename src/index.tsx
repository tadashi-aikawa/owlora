import '../node_modules/semantic-ui-css/semantic.min.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';

import {Task, Top} from './components/Top';
import {fetchProjects, fetchTasks} from './client/TodoistClient';
import Project from './models/todoist/Project';

const HOGEHOGE = 'TODO';
const LABELS = {
    760006: 5,
    760002: 15,
    760003: 30,
    760004: 60
};

Promise.all([fetchProjects(HOGEHOGE), fetchTasks(HOGEHOGE)])
    .then(([projects, todoistTasks]) => {
        const projectsById: Dictionary<Project> = _.keyBy(projects, p => p.id);

        const tasks: Task[] = _(todoistTasks)
            .filter(x => !x.checked && x.due_date_utc && x.labels.some(l => l in LABELS))
            .orderBy(x => x.project_id)
            .map(x => ({
                name: x.content,
                projectName: projectsById[String(x.project_id)].name,
                elapsedMinutes: _.find(LABELS, (v, k) => _.includes(x.labels, Number(k))),
                dueDate: x.due_date_utc
            }))
            .value();

        ReactDOM.render(
            <Top tasks={tasks}/>,
            document.getElementById("example")
        );
    });

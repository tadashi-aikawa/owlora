import * as React from 'react';
import * as _ from 'lodash';
import {Label, Popup} from 'semantic-ui-react';
import Task, {TaskUpdateParameter} from '../models/Task';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import {DragSource, DropTarget} from 'react-dnd';
import TaskFeeds from "./TaskFeeds";
import ImageOrEmoji from './ImageOrEmoji';
import {Dictionary} from 'lodash';

export interface EstimateIconGroupProps {
    tasks: Task[];
    taskSortFieldInPopup: TaskSortField;
    taskOrderInPopup: Order;

    onUpdateTask: (parameter: TaskUpdateParameter) => void;
    onRemoveTask: (id: number) => void;
}

const EstimateIconGroup = (props: EstimateIconGroupProps) =>
    <span>
        {
            _(props.tasks)
                .groupBy(t => t.icon)
                .map((tasks: Task[]) => ({
                    icon: tasks[0].icon,
                    minutes: _.sumBy(tasks, t => t.estimatedMinutes),
                    hasUnknown: tasks.some(t => !t.estimatedMinutes),
                    tasks: tasks
                }))
                .orderBy(x => x.minutes, 'desc')
                .map(x => (
                    <Popup flowing hoverable
                           key={x.icon}
                           position="top center"
                           trigger={
                               <div style={{display: "inline-block"}}>
                                   <div style={{
                                       display: "flex", flexDirection: "column",
                                       alignItems: "center", justifyContent: "center",
                                       marginLeft: 4, marginRight: 4, marginTop: 2, marginBottom: 2,
                                   }}>
                                       <div style={{width: 28, height: 28}}>
                                           <ImageOrEmoji src={x.icon} style={{width: "28px", height: "28px"}}/>
                                       </div>
                                       <Label color={x.hasUnknown ? 'violet' : 'teal'}
                                              style={{marginTop: 4, paddingTop: 4, paddingBottom: 4, borderRadius: 10}}>
                                           {x.minutes}{x.hasUnknown && ' + ?'}
                                       </Label>
                                   </div>
                               </div>
                           }
                    >
                        <TaskFeeds tasks={x.tasks}
                                   taskSortField={props.taskSortFieldInPopup}
                                   taskOrder={props.taskOrderInPopup}
                                   onUpdateTask={props.onUpdateTask}
                                   onRemoveTask={props.onRemoveTask}
                        />
                    </Popup>
                ))
                .value()
        }
    </span>;

export default EstimateIconGroup;

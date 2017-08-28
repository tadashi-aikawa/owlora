import * as React from 'react';
import {Component} from 'react';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import {
    Card,
    Container,
    Dimmer,
    Divider,
    Icon,
    Label,
    Message,
    Popup,
    Progress,
    Segment,
    SemanticCOLORS,
    Statistic
} from 'semantic-ui-react';
import {Moment, now} from 'moment';
import {DATE_FORMAT, SIMPLE_FORMAT} from '../storage/settings';
import Task, {TaskUpdateParameter} from '../models/Task';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import {DragSource, DropTarget} from 'react-dnd';
import {findDOMNode} from 'react-dom';
import TaskFeeds from "./TaskFeeds";
import Repetition from '../constants/Repetition';
import Milestone from './Milestone';
import EstimateIconGroup from './EstimateIconGroup';
import Emojify from 'react-emojione';

const groupByHours = (tasks: Task[]): Dictionary<Task[]> => {
    const estimatedTasksByHour: Dictionary<Task[]> = {};

    for (let t of tasks) {
        if (!(t.time)) {
            continue;
        }
        const hours: number[] = _.range(t.time.start.hour(), t.time.end.hour() + t.time.end.minutes() / 60);
        hours.forEach(h => {
            if (estimatedTasksByHour[h]) {
                estimatedTasksByHour[h].push(t);
            } else {
                estimatedTasksByHour[h] = [t];
            }
        })
    }

    return estimatedTasksByHour;
};

const CardHeader = ({props, freeMinutes, isOffTime}: {
    props: DailyCardProps, freeMinutes: number, isOffTime: boolean
}) => {
    const restPercent = freeMinutes / props.minutesToUsePerDay;

    const isWarning: boolean = _.inRange(restPercent, 0.20, 0.40);
    const isDanger: boolean = _.inRange(restPercent, 0, 0.20);
    const isDead: boolean = restPercent < 0;

    const color = isDead || isOffTime ? undefined :
        isDanger ? "red" : isWarning ? "yellow" : undefined;

    return (
        <Segment inverted style={{margin: 0}} color={isOffTime ? "grey" : isDead ? "red" : "black"}>
            <Statistic.Group widths='one' size='mini' inverted
                             color={color}
                             style={{paddingBottom: 10}}>
                <Statistic value={props.date.format(DATE_FORMAT)}/>
            </Statistic.Group>
            {
                isOffTime ?
                    <Statistic.Group widths='one' size='tiny' inverted>
                        <Statistic>
                            <Statistic.Value>
                                <Emojify>:laughing: Off day!! :laughing:</Emojify>
                            </Statistic.Value>
                        </Statistic>
                    </Statistic.Group>
                    :
                    <Progress value={freeMinutes}
                              total={props.minutesToUsePerDay}
                              color={isDead || isDanger ? "red" : isWarning ? "yellow" : "green"}
                              size="small"
                              inverted
                              disabled={isOffTime}
                    >
                        {isDead && <Emojify style={{height: 20, width: 20, marginLeft: 10}}>:innocent:</Emojify>}
                        <Icon name="heart" color={color}/> <span style={{color: color}}>{freeMinutes}</span>
                        {isDead && <Emojify style={{height: 20, width: 20, marginLeft: 10}}>:innocent:</Emojify>}
                    </Progress>
            }
        </Segment>
    );
};

export interface DailyCardProps {
    date: Moment;
    tasks: Task[];
    taskSortField: TaskSortField;
    taskOrder: Order;
    isTasksExpanded: boolean;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: Dictionary<number>;

    connectDropTarget?: Function;
    isOver?: boolean;
    canDrop?: boolean;

    onUpdateTask: (parameter: TaskUpdateParameter) => void;
}


@DropTarget(
    'task',
    {
        drop(props: DailyCardProps, monitor) {
            if (monitor.didDrop()) {
                return;
            }

            return {
                date: props.date
            };
        },

        canDrop(props: DailyCardProps, monitor) {
            return props.date.isSameOrAfter(now(), 'day') &&
                !props.date.isSame(monitor.getItem().date, 'day');
        }
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    })
)
export default class extends Component<DailyCardProps> {
    shouldComponentUpdate(nextProps: Readonly<DailyCardProps>) {
        // For avoid performance issues
        return !(this.props === nextProps || _.isEqual(
            _.omit(this.props, ['canDrop']),
            _.omit(nextProps, ['canDrop']),
        ))
    }

    render() {
        const estimatedTasks: Task[] = _(this.props.tasks)
            .filter(t => t.repetition !== Repetition.EVERY_DAY && t.repetition !== Repetition.WEEKDAY)
            .reject(t => t.isMilestone)
            .value();
        const estimatedTasksByHours: Dictionary<Task[]> = groupByHours(estimatedTasks);

        const totalEstimatedMinutes = _.sumBy(estimatedTasks, t => t.estimatedMinutes);
        const specifiedMinutes = this.props.minutesToUsePerSpecificDays[this.props.date.format(SIMPLE_FORMAT)];
        const minutesToUse = specifiedMinutes !== undefined ? specifiedMinutes : this.props.minutesToUsePerDay;
        const freeMinutes = minutesToUse - totalEstimatedMinutes;

        return (
            <Card ref={node => this.props.connectDropTarget(findDOMNode(this))}>
                <Dimmer active={this.props.date.isBefore(now(), 'day')} content={
                    <div>
                        <h2>Facing forward !!</h2>
                        <Icon name='hand outline right' size='huge'/>
                    </div>
                }/>
                <Dimmer active={!this.props.canDrop && this.props.isOver}
                        style={{backgroundColor: "grey", opacity: 0.5}}
                        content=""/>
                <Dimmer active={this.props.canDrop && this.props.isOver}
                        style={{backgroundColor: "red", opacity: 0.5}}
                        content={
                            <div>
                                <h2>Change duedate</h2>
                                <Icon name='arrow circle outline down' size='huge'/>
                            </div>
                        }/>
                <CardHeader props={this.props}
                            freeMinutes={freeMinutes}
                            isOffTime={minutesToUse === 0}
                />
                <Card.Content>
                    <Container textAlign="center">
                        {_.range(10, 20).map(h =>
                            <Popup flowing hoverable
                                   key={h}
                                   position="top center"
                                   openOnTriggerMouseEnter={!!estimatedTasksByHours[h]}
                                   trigger={
                                       <Label key={h} content={h} size="mini" circular
                                              color={estimatedTasksByHours[h] ? "red" : "grey"}/>
                                   }
                            >
                                <TaskFeeds tasks={estimatedTasksByHours[h]}
                                           taskSortField={this.props.taskSortField}
                                           taskOrder={this.props.taskOrder}
                                           onUpdateTask={this.props.onUpdateTask}
                                />
                            </Popup>
                        )}
                    </Container>
                    <Message negative icon hidden={freeMinutes >= 0}>
                        <Icon name='warning sign'/>
                        <Message.Content>
                            <Message.Header>
                                Move your tasks to other days!!
                            </Message.Header>
                        </Message.Content>
                    </Message>
                    {this.props.tasks.filter(t => t.isMilestone)
                        .map(t => <Milestone key={t.id}
                                             id={t.id}
                                             name={t.name}
                                             color={t.color as SemanticCOLORS}
                                             size={t.size}
                                             date={t.dueDate}
                                             onUpdate={this.props.onUpdateTask}
                        />)}
                    <Divider horizontal>
                        <Popup flowing hoverable
                               position="bottom center"
                               openOnTriggerMouseEnter={
                                   estimatedTasks.length > 0 && !this.props.isTasksExpanded
                               }
                               trigger={
                                   <span>{estimatedTasks.length} Tasks</span>
                               }
                        >
                            <TaskFeeds tasks={estimatedTasks}
                                       taskSortField={this.props.taskSortField}
                                       taskOrder={this.props.taskOrder}
                                       onUpdateTask={this.props.onUpdateTask}
                            />
                        </Popup>
                    </Divider>
                    <div style={
                        this.props.isTasksExpanded ?
                            {
                                opacity: 1,
                                maxHeight: "100%",
                                transform: "scaleY(1)",
                                transformOrigin: "top",
                                transition: "all 0.5s",
                            } :
                            {
                                opacity: 0,
                                maxHeight: 0,
                                transform: "scaleY(0)",
                                transformOrigin: "top",
                                transition: "all 0.5s",
                            }
                    }>
                        <TaskFeeds tasks={estimatedTasks}
                                   taskSortField={this.props.taskSortField}
                                   taskOrder={this.props.taskOrder}
                                   onUpdateTask={this.props.onUpdateTask}/>
                    </div>
                </Card.Content>
                < Card.Content extra>
                    < EstimateIconGroup
                        tasks={estimatedTasks}
                        taskSortFieldInPopup={this.props.taskSortField
                        }
                        taskOrderInPopup={this.props.taskOrder
                        }
                        onUpdateTask={this.props.onUpdateTask
                        }
                    />
                </Card.Content>
            </Card>
        );
    }
};

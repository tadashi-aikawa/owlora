import * as React from 'react';
import {Component} from 'react';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import {
    Card,
    Dimmer,
    Divider,
    Icon,
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
import {TaskFeeds} from "./TaskFeeds";
import CardAppearance from '../constants/CardAppearance';
import Repetition from '../constants/Repetition';
import Milestone from './Milestone';
import EstimateIconGroup from './EstimateIconGroup';
import Emojify from 'react-emojione';


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
    appearance: CardAppearance;
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
                                   estimatedTasks.length > 0 && this.props.appearance === CardAppearance.OVERVIEW
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
                        this.props.appearance === CardAppearance.DETAIL ?
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
                <Card.Content extra>
                    <EstimateIconGroup tasks={estimatedTasks}
                                       taskSortFieldInPopup={this.props.taskSortField}
                                       taskOrderInPopup={this.props.taskOrder}
                                       onUpdateTask={this.props.onUpdateTask}/>
                </Card.Content>
            </Card>
        );
    }
};

import * as React from 'react';
import * as _ from 'lodash';
import Emojify from 'react-emojione';
import {Dictionary} from 'lodash';
import {Dimmer, Card, Feed, Icon, Message, Progress, Segment, Statistic} from 'semantic-ui-react';
import {Moment, now} from 'moment';
import {DATE_FORMAT, SIMPLE_FORMAT} from '../storage/settings';
import Task, {TaskUpdateParameter} from '../models/Task';
import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import {DragSource, DropTarget} from 'react-dnd';
import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {TaskFeeds} from "./TaskFeeds";


const Fire = ({minutes}: { minutes: number }) =>
    <span>
        <Icon name="fire"/><Icon name="fire"/><Icon name="fire"/>
        Lack {minutes} <Icon name="heart"/>
        <Icon name="fire"/><Icon name="fire"/><Icon name="fire"/>
    </span>;

const Milestone = ({header, body}: { header: string, body: string }) =>
    <Message icon color="violet">
        <Icon name='diamond'/>
        <Message.Content>
            <Message.Header><Emojify>{header}</Emojify></Message.Header>
            <p><Emojify>{body}</Emojify></p>
        </Message.Content>
    </Message>;

export interface DailyCardProps {
    date: Moment;
    tasks: Task[];
    taskSortField: TaskSortField;
    taskOrder: Order;
    minutesToUsePerDay: number;
    minutesToUsePerSpecificDays: Dictionary<number>;

    connectDropTarget?: Function;
    isOver?: boolean;
    canDrop?: boolean;

    onUpdateTask: (parameter: TaskUpdateParameter) => void;
}

@DropTarget(
    'task-feed',
    {
        drop(props: DailyCardProps, monitor, component) {
            if (monitor.didDrop()) {
                return;
            }

            return {
                date: props.date
            };
        },

        canDrop(props: DailyCardProps, monitor) {
            return !_.includes(props.tasks.map(x => x.id), monitor.getItem().id)
        }
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    })
)
export default class extends Component<DailyCardProps> {
    componentDidMount() {
        this.props.connectDropTarget(findDOMNode(this));
    }

    render() {
        const totalElapsedMinutes = _.sumBy(
            this.props.tasks.filter(t => t.dateString !== '毎日' && t.dateString !== '平日'),
            t => t.estimatedMinutes
        );
        const specifiedMinutes = this.props.minutesToUsePerSpecificDays[this.props.date.format(SIMPLE_FORMAT)];
        const minutesToUse = specifiedMinutes !== undefined ? specifiedMinutes : this.props.minutesToUsePerDay;
        const freeMinutes = minutesToUse - totalElapsedMinutes;

        return (
            <Card>
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
                <Dimmer active={this.props.date.isBefore(now(), 'day')} content={
                    <div>
                        <h2>Facing forward !!</h2>
                        <Icon name='hand outline right' size='huge'/>
                    </div>
                }/>
                <Segment inverted>
                    <Statistic size='mini' color="olive">
                        <Statistic.Value>{this.props.date.format(DATE_FORMAT)}</Statistic.Value>
                    </Statistic>
                    <Progress value={freeMinutes}
                              total={this.props.minutesToUsePerDay}
                              color="green"
                              size="small"
                              inverted="true"
                              error={freeMinutes / this.props.minutesToUsePerDay < 0.20}
                              warning={freeMinutes / this.props.minutesToUsePerDay < 0.40}
                              disabled={minutesToUse === 0}
                    >
                        {
                            freeMinutes < 0
                                ? <Fire minutes={-freeMinutes}/>
                                : <span><Icon name="heart"/> {freeMinutes}</span>
                        }
                    </Progress>
                </Segment>
                <Card.Content>
                    {this.props.tasks.filter(t => t.isMilestone)
                        .map(t => <Milestone key={t.id} header={t.projectName} body={t.name}/>)}
                    <Message info icon hidden={specifiedMinutes !== 0}>
                        <Icon name='smile'/>
                        <Message.Content>
                            <Message.Header>
                                Off time
                            </Message.Header>
                            <p>Enjoy without tasks</p>
                        </Message.Content>
                    </Message>
                    <Message negative icon hidden={freeMinutes >= 0}>
                        <Icon name='warning sign'/>
                        <Message.Content>
                            <Message.Header>
                                Move your tasks to other days!!
                            </Message.Header>
                        </Message.Content>
                    </Message>
                    <TaskFeeds tasks={this.props.tasks}
                               taskSortField={this.props.taskSortField}
                               taskOrder={this.props.taskOrder}
                               onUpdateTask={this.props.onUpdateTask}/>
                </Card.Content>
            </Card>
        );
    }
};

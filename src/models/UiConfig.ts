import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import {SemanticWIDTHS} from 'semantic-ui-react';


interface UiConfig {
    icebox: boolean;
    filter: boolean,
    timeLamps: boolean;
    milestone: boolean;
    seal: boolean;
    warning: boolean;
    isTasksExpanded: boolean;
    taskSortField: TaskSortField;
    taskOrder: Order;
    numberOfCardsPerRow: SemanticWIDTHS;
    numberOfCards: number;
    onlyWeekday: boolean;
}

export default UiConfig;


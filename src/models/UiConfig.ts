import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import {SemanticWIDTHS} from 'semantic-ui-react';
import CardAppearance from '../constants/CardAppearance';


interface UiConfig {
    cardAppearance: CardAppearance;
    isIceboxVisible: boolean;
    taskSortField: TaskSortField;
    taskOrder: Order;
    numberOfCardsPerRow: SemanticWIDTHS;
}

export default UiConfig;


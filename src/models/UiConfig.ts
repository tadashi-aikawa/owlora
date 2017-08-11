import TaskSortField from '../constants/TaskSortField';
import Order from '../constants/Order';
import {SemanticWIDTHS} from 'semantic-ui-react';
import CardAppearance from '../constants/CardAppearance';
import DayAppearance from "../constants/DayAppearance";


interface UiConfig {
    cardAppearance: CardAppearance;
    isIceboxVisible: boolean;
    taskSortField: TaskSortField;
    taskOrder: Order;
    numberOfCardsPerRow: SemanticWIDTHS;
    numberOfCards: number;
    dayAppearance: DayAppearance;
}

export default UiConfig;


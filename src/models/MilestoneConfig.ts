import Size from '../constants/Size';

interface Condition {
    regexp?: string;
    projectIdsOr?: number[];
    labelIdsOr?: number[];
}

interface MilestoneConfig {
    color: string;
    size?: Size;
    condition: Condition;
}

export default MilestoneConfig;
export {
    Condition
}

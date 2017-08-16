interface Condition {
    regexp: string;
    projectIdsOr: number[];
    labelIdsOr: number[];
}

interface MilestoneConfig {
    color: string;
    condition: Condition;
}

export default MilestoneConfig;
export {
    Condition
}

interface Condition {
    regexp?: string;
    labelId?: number;
    projectId?: number;
}

interface EstimateConfig {
    minutes: number;
    condition: Condition;
}

export default EstimateConfig;
export {
    Condition
}

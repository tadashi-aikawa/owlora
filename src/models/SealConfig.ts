interface Condition {
    regexp?: string;
    projectIdsOr?: number[];
    labelIdsOr?: number[];
}

interface SealConfig {
    color: string;
    condition: Condition;
}

export default SealConfig;
export {
    Condition
}

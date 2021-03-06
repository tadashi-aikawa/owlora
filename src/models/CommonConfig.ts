import {Dictionary} from 'lodash';
import MilestoneConfig from './MilestoneConfig';
import EstimateConfig from './EstimateConfig';
import SealConfig from './SealConfig';
import {safeLoad} from 'js-yaml';

interface DictAndYaml<T> {
    dict: Dictionary<T>;
    yaml: string;
}

module DictAndYaml {
    export const fromYaml = <T>(yaml: string): DictAndYaml<T> => ({
        dict: yaml ? safeLoad(yaml) : {},
        yaml: yaml,
    });
    export const toYaml = <T>(x: DictAndYaml<T>): string => x ? x.yaml : "";
}

interface ArrayAndYaml<T> {
    array: T[];
    yaml: string;
}

module ArrayAndYaml {
    export const fromYaml = <T>(yaml: string): ArrayAndYaml<T> => ({
        array: yaml ? safeLoad(yaml) : [],
        yaml: yaml,
    });
    export const toYaml = <T>(x: ArrayAndYaml<T>): string => x ? x.yaml : "";
}

interface CommonConfigValue {
    estimates: EstimateConfig[];
    milestones: MilestoneConfig[];
    seals: SealConfig[];
    iconsByProject: Dictionary<string>;
    colorsByTaskNameRegexp: Dictionary<string>;
}

interface CommonConfig {
    minutesToUsePerDay: number;
    estimates: ArrayAndYaml<EstimateConfig>;
    milestones: ArrayAndYaml<MilestoneConfig>;
    seals: ArrayAndYaml<SealConfig>;
    minutesToUsePerSpecificDays: DictAndYaml<number>;
    lampTime: {
        begin: number,
        end: number,
    },
    iconsByProject: DictAndYaml<string>;
    colorsByTaskNameRegexp: DictAndYaml<string>;
}

export default CommonConfig;
export {
    CommonConfigValue,
    DictAndYaml,
    ArrayAndYaml,
}

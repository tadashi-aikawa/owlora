const matchRegExp = (
    value: string | undefined,
    regExp: string,
    caseSensitive: boolean,
    perfect: boolean,
): boolean =>
    value !== undefined &&
    regExp &&
    !!value.match(new RegExp(perfect ? `^${regExp}$` : regExp, caseSensitive ? "" : "i"))

export const match = (value: string, regExp: string): boolean => matchRegExp(value, regExp, false, true)
export const iMatch = (value: string, regExp: string): boolean => matchRegExp(value, regExp, true, true)
export const includes = (value: string, regExp: string): boolean => matchRegExp(value, regExp, false, false)
export const iIncludes = (value: string, regExp: string): boolean => matchRegExp(value, regExp, true, false)
export const isNaturalNumber = (value: string): boolean => matchRegExp(value, "\\d+", true, true)

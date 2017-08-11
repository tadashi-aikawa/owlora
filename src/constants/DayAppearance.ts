enum DayAppearance {
    ALL_DAY = 'allday',
    WEEKDAY = 'weekday',
}

module DayAppearance {
    export const toObject = {
        [DayAppearance.ALL_DAY]: DayAppearance.ALL_DAY,
        [DayAppearance.WEEKDAY]: DayAppearance.WEEKDAY,
    };
}

export default DayAppearance;

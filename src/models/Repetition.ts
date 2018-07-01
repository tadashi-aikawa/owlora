import {Moment} from "moment";

type Pattern = "every" | "every other";

class Repetition {
    day: number[] | Pattern;
    // 0: Sun, 1: Mon, ... 6: Sat
    dayOfWeek: number[];
    week: number[] | Pattern;
    month: number[] | Pattern;
    datesExcepted: Moment[];

    constructor(init?: Partial<Repetition>) {
        Object.assign(this, init);
    }

    // Ex. "every mon,fri" or "every other mon,fri"
    static fromDaysOfWeek(daysOfWeek: number[], pattern: Pattern): Repetition {
       return new Repetition({
            day: "every",
            dayOfWeek: daysOfWeek,
            week: pattern,
            month: "every",
        });
    }

    addDatesExcepted(dates: Moment[]): Repetition {
        this.datesExcepted = dates;
        return this;
    }
}

const EVERY_DAY = new Repetition({
    day: "every",
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
    week: "every",
    month: "every",
});

const EVERY_WEEK_DAY = new Repetition({
    day: "every",
    dayOfWeek: [1, 2, 3, 4, 5],
    week: "every",
    month: "every",
});

export {
    Repetition,
    Pattern,
    EVERY_DAY,
    EVERY_WEEK_DAY,
};

import {Moment} from "moment";

type Pattern = "every" | "every other";

class Repetition {
    day: number[] | "every";
    // 0: Sun, 1: Mon, ... 6: Sat
    dayOfWeek: number[];
    week: number[] | Pattern;
    month: number[] | Pattern;
    datesExcepted: Moment[];

    constructor(init?: Partial<Repetition>) {
        Object.assign(this, init);
    }

    static get everyDay() {
        return new Repetition({
            day: "every",
            dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
            week: "every",
            month: "every",
        });
    }

    static get everyWeekDay() {
        return new Repetition({
            day: "every",
            dayOfWeek: [1, 2, 3, 4, 5],
            week: "every",
            month: "every",
        });
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

    // Ex. "every 1,15" or "every other 1,15"
    static fromDays(days: number[], pattern: Pattern): Repetition {
       return new Repetition({
            day: days,
            dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
            week: "every",
            month: pattern,
        });
    }

    addDatesExcepted(dates: Moment[]): Repetition {
        this.datesExcepted = dates;
        return this;
    }
}


export {
    Repetition,
    Pattern,
};

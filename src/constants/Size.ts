import {Dictionary} from 'lodash';

enum Size {
    MINI = 'mini',
    TINY = 'tiny',
    SMALL = 'small',
    LARGE = 'large',
    BIG = 'big',
    HUGE = 'huge',
    MASSIVE = 'massive',
}

module Size {
    export const toObject: Dictionary<Size> = {
        [Size.MINI]: Size.MINI,
        [Size.TINY]: Size.TINY,
        [Size.SMALL]: Size.SMALL,
        [Size.LARGE]: Size.LARGE,
        [Size.BIG]: Size.BIG,
        [Size.HUGE]: Size.HUGE,
        [Size.MASSIVE]: Size.MASSIVE,
    };

    export const toEmojiSize = {
        [Size.MINI]: 18,
        [Size.TINY]: 22,
        [Size.SMALL]: 26,
        [Size.LARGE]: 30,
        [Size.BIG]: 34,
        [Size.HUGE]: 38,
        [Size.MASSIVE]: 64
    };
}


export default Size;

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

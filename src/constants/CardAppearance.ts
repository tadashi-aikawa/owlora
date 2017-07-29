enum CardAppearance {
    OVERVIEW = 'overview',
    DETAIL = 'detail',
}

module CardAppearance {
    export const toObject = {
        [CardAppearance.OVERVIEW]: CardAppearance.OVERVIEW,
        [CardAppearance.DETAIL]: CardAppearance.DETAIL,
    };
}

export default CardAppearance;

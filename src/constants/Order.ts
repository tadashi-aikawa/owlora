enum Order {
    ASC = 'asc',
    DESC = 'desc',
}

module Order {
    export const toObject = {
        [Order.ASC]: Order.ASC,
        [Order.DESC]: Order.DESC,
    };
    export const iconNames = {
        [Order.ASC]: "sort content ascending",
        [Order.DESC]: "sort content descending",
    };
    export const inverses = {
        [Order.ASC]: Order.DESC,
        [Order.DESC]: Order.ASC,
    };
}

export default Order;

enum Order {
    ASC = 'asc',
    DESC = 'desc',
}

module Order {
    export const toObject = {
        [Order.ASC]: Order.ASC,
        [Order.DESC]: Order.DESC,
    };
}

export default Order;

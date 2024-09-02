export const TYPES_ORDERS = {
    ALL_ORDERS:"ALL_ORDERS",
    NO_ORDERS:"NO_ORDERS",
    GET_ORDER:"GET_ORDER",
    CLOSE_EDIT:"CLOSE_EDIT"
}
export const ordersInitialReducer = {
    orders:[],
    orderEdit:{},
    quotationsEdit:[],
    provinces: [],
    districs: [],
    quotationsNew: []
}
export const reducerOrders = (state,action) =>{
    switch (action.type) {
        case TYPES_ORDERS.ALL_ORDERS:{
            return {
                ...state,
                orders:action.payload
            }
        }
        case TYPES_ORDERS.GET_ORDER:{
            return {
                ...state,
                orderEdit:action.payload.order,
                quotationsEdit:action.payload.quotations,
                provinces: action.payload.provinces,
                districs: action.payload.districs,
                quotationsNew: action.payload.quotationsNew
            }
        }
        case TYPES_ORDERS.CLOSE_EDIT:{
            return {
                ...state,
                orderEdit:{},
                quotationsEdit:[]
            }
        }
        case TYPES_ORDERS.NO_ORDERS:{
            return state;
        }
    }
}
export const TYPES_CUSTOMERS = {
    ALL_DEPARTAMENTS_DOCUMENTS:"ALL_DEPARTAMENTS_DOCUMENTS",
    NO_CUSTOMERS:"NO_CUSTOMERS",
    ALL_CUSTOMERS:"ALL_CUSTOMERS",
    CLOSE_EDIT:"CLOSE_EDIT",
    ADD_CUSTOMER:"ADD_CUSTOMER",
    GET_CUSTOMER:"GET_CUSTOMER",
    UPDATE_CUSTOMER:"UPDATE_CUSTOMER",
    DELETE_CUSTOMER:"DELETE_CUSTOMER"
}
export const customersIntialState = {
    departaments:[],
    typeDocuments:[],
    contries:[],
    customers:[],
    customerEdit:{},
    customerContactsEdit:[],
    provinces:[],
    districts:[]
}
export const reducerCustomers = (state,actions) => {
    switch (actions.type) {
        case TYPES_CUSTOMERS.ALL_DEPARTAMENTS_DOCUMENTS:{
            return {
                ...state,
                departaments:actions.payload.departaments,
                typeDocuments:actions.payload.documents,
                contries:actions.payload.contries
            }
        }
        case TYPES_CUSTOMERS.ALL_CUSTOMERS:{
            return {
                ...state,
                customers: actions.payload
            }
        }
        // case TYPES_CUSTOMERS.ADD_CUSTOMER:{
        //     return {
        //         ...state,
        //         customers: [...state.customers,actions.payload]
        //     }
        // }
        case TYPES_CUSTOMERS.CLOSE_EDIT:{
            return {
                ...state,
                provinces: [],
                districts: [],
                customerEdit: {},
                customerContactsEdit: []
            }
        }
        case TYPES_CUSTOMERS.DELETE_CUSTOMER:{
            return {
                ...state,
                customers: state.customers.filter(customer => customer.id != actions.payload)
            }
        }
        case TYPES_CUSTOMERS.UPDATE_CUSTOMER:{
            return {
                ...state,
                customers:state.customers.map(customer => customer.id == actions.payload.id ? actions.payload : customer)
            }
        }
        case TYPES_CUSTOMERS.GET_CUSTOMER:{
            return {
                ...state,
                provinces: actions.payload.provinces,
                districts: actions.payload.districts,
                customerEdit: actions.payload.customer,
                customerContactsEdit: actions.payload.contacts
            }
        }
        case TYPES_CUSTOMERS.NO_CUSTOMERS:{
            return state;
        }
    }
}
export const TYPES_QUOTATIONS = {
    ALL_QUOTATIONS : "ALL_QUOTATIONS",
    NO_QUOTATION:"NO_QUOTATION",
    GET_QUOTATION:"GET_QUOTATION",
    CLOSE_QUOTATION:"CLOSE_QUOTATION"
}
export const quotationInitialState = {
    quotations:[],
    quotationEdit:{},
    contactsEdit:[],
    productsDetails:[]
}
export const reducerQuotations = (state,action) => {
    switch (action.type) {
        case TYPES_QUOTATIONS.ALL_QUOTATIONS:{
            return {
                ...state,
                quotations:action.payload
            }
        }
        case TYPES_QUOTATIONS.GET_QUOTATION:{
            return {
                ...state,
                quotationEdit:action.payload.quotation,
                contactsEdit:action.payload.contacs,
                productsDetails:action.payload.products
            }
        }
        case TYPES_QUOTATIONS.CLOSE_QUOTATION:{
            return {
                ...state,
                quotationEdit:{},
                contactsEdit:[],
                productsDetails:[]
            }
        }
        case TYPES_QUOTATIONS.NO_QUOTATION:{
            return state;
        }
    }
}
export const TYPES_PRODUCTS = {
    ALL_PRODUCTS:"ALL_PRODUCTS",
    NO_PRODUCTS:"NO_PRODUCTS",
    RESET_EDIT:"RESET_EDIT",
    ALL_CATEGORIES:"ALL_CATEGORIES",
    GET_PRODUCT:"GET_PRODUCT",
    ALL_STORES: "ALL_STORES"
}
export const initialStateProduct = {
    products:[],
    categories:[],
    subcategories:[],
    productEdit:{},
    stores : []
}
export const reducerProducts = (state,actions) => {
    switch (actions.type) {
        case TYPES_PRODUCTS.ALL_PRODUCTS:{
            return {
                ...state,
                products:actions.payload
            }
        }
        case TYPES_PRODUCTS.NO_PRODUCTS:{
            return state
        }
        case TYPES_PRODUCTS.ALL_CATEGORIES:{
            return {
                ...state,
                categories:actions.payload
            }
        }
        case TYPES_PRODUCTS.ALL_STORES:{
            return {
                ...state,
                stores:actions.payload
            }
        }
        case TYPES_PRODUCTS.GET_PRODUCT:{
            const urlProduct = actions.payload.product.product_img;
            return {
                ...state,
                productEdit:{
                    ...actions.payload.product,
                    product_img: urlProduct ? actions.payload.url + '/' + urlProduct : null,
                    product_categorie: actions.payload.categorieId
                },
                subcategories:actions.payload.subcategories
            }
        }
        case TYPES_PRODUCTS.RESET_EDIT:{
            return {
                ...state,
                productEdit:{},
            };
        }
    }
}
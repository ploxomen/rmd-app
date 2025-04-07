export const TYPES_CATEGORIES = {
    ALL_CATEGORIES : "ALL_CATEGORIES",
    CREATE_CATEGORIE : "CREATE_CATEGORIE",
    UPDATE_CATEGORIE : "UPDATE_CATEGORIE",
    DELETE_CATEGORIE : "DELETE CATEGORIE",
    NO_CATEGORIES: "NO_CATEGORIES",
    RESET_EDIT:"RESET_EDIT",
    GET_CATEGORIE:"GET_CATEGORIE"
}
export const categoriesInitialState = {
    categories:[],
    categorieEdit:{},
    subcategoriesEdit:[]
}
export const reducerCategories = (state,action) => {
    switch (action.type) {
        case TYPES_CATEGORIES.ALL_CATEGORIES:{
            return {
                ...state,
                categories:action.payload
            }
        }
        case TYPES_CATEGORIES.NO_CATEGORIES:{
            return state;
        }
        case TYPES_CATEGORIES.GET_CATEGORIE:{
            return {
                ...state,
                categorieEdit:action.payload.categorie,
                subcategoriesEdit:action.payload.subcategories
            };
        }
        case TYPES_CATEGORIES.RESET_EDIT:{
            return {
                ...state,
                categorieEdit:{},
                subcategoriesEdit:[]
            };
        }
    }
}
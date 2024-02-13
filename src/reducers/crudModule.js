export const TYPES_MODULE = {
    READ_ALL_MODULES:"READ_ALL_MODULES",
    GET_MODULE_ROLE:"GET_MODULE_ROLE",
    NO_MODULES:"TYPES_MODULE",
    RESET_MODULES:"RESET_MODULES",
    CHANGE_CHECKED_ROLES:"CHANGE_CHECKED_ROLES"
}
export const crudModulesInitialState = {
    modules:[],
    roles:[],
    idModule:null
}
export const reducerModules = (state,actions) => {
    switch (actions.type) {
        case TYPES_MODULE.READ_ALL_MODULES:{
            return {
                ...state,
                modules: actions.payload
            }
        }
        case TYPES_MODULE.CHANGE_CHECKED_ROLES:{
            return {
                ...state,
                roles: state.roles.map(role => role.id == actions.payload ? {...role,checked:(role.checked === 1 ? 0 : 1)} : role)
            }
        }
        case TYPES_MODULE.GET_MODULE_ROLE:{
            return {
                ...state,
                roles: actions.payload.roles,
                idModule: actions.payload.module
            }
        }
        case TYPES_MODULE.RESET_MODULES:{
            return {
                ...state,
                Q: []
            }
        }
        case TYPES_MODULE.NO_MODULES:{
            return crudModulesInitialState;
        }
        default:
            return state;
    }
}
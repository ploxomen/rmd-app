export const TYPES = {
    CREATE_ROLE:"CREATE_ROLE",
    READ_ALL_ROLES:"READ_ALL_ROLES",
    UPDATE_ROLE:"UPDATE_ROLE",
    DELETE_ROLE:"DELETE_ROLE",
    NO_ROLE:"NO_ROLE",
    GET_ROLE_MODULES:"GET_ROLE_MODULES",
    RESET_MODULES:"RESET_MODULES",
    CHANGE_CHECKED_MODULES:"CHANGE_CHECKED_MODULES"
}
export const crudRoleInitialState = {
    roles:[],
    modules:[],
    idRole:null
}
export const reducerRoles = (state,actions) => {
    switch (actions.type) {
        case TYPES.READ_ALL_ROLES:{
            return {
                ...state,
                roles: actions.payload
            }
        }
        case TYPES.CREATE_ROLE:{
            return {
                ...state,
                roles: [...state.roles,actions.payload]
            }
        }
        case TYPES.GET_ROLE_MODULES:{
            return {
                ...state,
                modules: actions.payload.modules,
                idRole: actions.payload.role
            }
        }
        case TYPES.CHANGE_CHECKED_MODULES:{
            return {
                ...state,
                modules: state.modules.map(module => module.id == actions.payload ? {...module,checked:(module.checked === 1 ? 0 : 1)} : module)
            }
        }
        case TYPES.RESET_MODULES:{
            return {
                ...state,
                modules: []
            }
        }
        case TYPES.UPDATE_ROLE:{
            return {
                ...state,
                roles: state.roles.map(role => role.id == actions.payload.id ? actions.payload : role)
            }
        }
        case TYPES.DELETE_ROLE:{
            return {
                ...state,
                roles: state.roles.filter(role => role.id !== actions.payload)
            }
        }
        case TYPES.NO_ROLE:{
            return crudRoleInitialState;
        }
        default:
            return state;
    }
}
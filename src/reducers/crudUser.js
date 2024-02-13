export const TYPES_USER = {
    ALL_USERS:"ALL_USERS",
    ALL_ROLES:"ALL_ROLES",
    ADD_USER:"ADD_USER",
    UPDATE_USER:"UPDATE_USER",
    NO_USERS:"NO_USERS",
    GET_USER:"GET_USER",
    CLOSE_EDIT:"CLOSE_EDIT",
    CHANGE_ID_USER:"CHANGE_ID_USER",
    CLEAR_ID_USER:"CLEAR_ID_USER",
    DELETE_USER:"DELETE_USER"
}
export const crudUserInitialState = {
    roles:[],
    users:[],
    idUser:null,
    rolesEdit:[],
    userEdit:{},
    typeDocuments:[]
}
export const reducerUsers = (state,actions)=>{
    switch (actions.type) {
        case TYPES_USER.ALL_USERS:{
            return {
                ...state,
                users: actions.payload
            }
        }
        case TYPES_USER.ALL_ROLES_DOCUMENT:{
            return {
                ...state,
                roles: actions.payload.roles,
                typeDocuments: actions.payload.documents
            }
        }
        case TYPES_USER.GET_USER:{
            return {
                ...state,
                rolesEdit: actions.payload.roles,
                userEdit: actions.payload.user
            }
        }
        case TYPES_USER.ADD_USER:{
            return {
                ...state,
                users: [...state.users,actions.payload]
            }
        }
        case TYPES_USER.CLOSE_EDIT:{
            return {
                ...state,
                rolesEdit: [],
                userEdit:{}
            }
        }
        case TYPES_USER.CHANGE_ID_USER:{
            return {
                ...state,
                idUser:actions.payload
            }
        }
        case TYPES_USER.UPDATE_USER:{
            return {
                ...state,
                users:state.users.map(user => user.id === actions.payload.id ? actions.payload : user)
            }
        }
        case TYPES_USER.CLEAR_ID_USER:{
            return {
                ...state,
                idUser:null
            }
        }
        case TYPES_USER.DELETE_USER:{
            return {
                ...state,
                users:state.users.filter(user => user.id != actions.payload)
            }
        }
        case TYPES_USER.NO_USERS:{
            return state
        }
    }

}
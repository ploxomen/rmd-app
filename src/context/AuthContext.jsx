import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
    user:null,
    setUser:()=>{},
    csrfToken:()=>{}
});
export const AuthProvider = ({children}) => {
    const [user,_setUser] = useState(Cookies.get('authenticate') ? JSON.parse(Cookies.get('authenticate')) : null);
    const setUser = (user) => {
        if(user){
            Cookies.set('authenticate',JSON.stringify(user),{path:'/'});
        }else{
            Cookies.remove('authenticate',{path:'/'});
        }
        _setUser(user);
    }
    const csrfToken = async () => {
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
        return true;
    }
    return <AuthContext.Provider value={{user,setUser,csrfToken}}>
        {children}
    </AuthContext.Provider>
}
export const useAuth = () => {
    return useContext(AuthContext);
}
import apiAxios from "@/axios";

export const verifUser = async (userCookie,currentRoute) => {
    if(!userCookie.authenticate){
        return {
            redirect : {
                destination: '/account/login',
                permanent:false
            }
        }
    }
    const contentCookieUser = JSON.parse(userCookie.authenticate);

    const headers = {
        'Authorization':'Bearer ' + contentCookieUser.access_token
    }
    let dataModules = [];
    let dataRoles = [];
    let dataUser = {
        user_name:"",
        user_last_name:"",
        user_avatar:null
    };
    try {
      const req = await apiAxios.get('/user/modules-roles',{headers,params:{url:currentRoute}});
      if(req.data && req.data.redirect !== null){
        return {
            redirect : {
                destination: req.data.redirect,
                permanent:false
            }
        }
      }
      dataModules = req.data.modules;
      dataRoles = req.data.roles;
      dataUser = req.data.user;
      return {
            props:{
                dataModules,
                dataRoles,
                dataUser            
            }
        }
    } catch {
        return {
            props:{
              dataModules,
              dataRoles,
              dataUser            
          }
        }
    }
}
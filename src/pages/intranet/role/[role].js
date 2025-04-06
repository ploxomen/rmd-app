import apiAxios from '@/axios';
import React from 'react'

export async function getServerSideProps(context) {
    let userCookie = context.req.cookies;
    const {role} = context.params
    if(!userCookie.authenticate){
        return {
            redirect : {
                destination: '/login',
                permanent:false
            }
        }
    }
    userCookie = JSON.parse(userCookie.authenticate);
    const headers = {'Authorization':'Bearer ' + userCookie.access_token};
    try {
        const resp = await apiAxios.get('/user/change-role/' + role,{headers});
        if(resp.data.redirect !== null){
            return {
                redirect : {
                    destination: resp.data.redirect,
                    permanent:false
                }
            }
        }
    }catch{
        return {
            props:{}
        }
    }   
}
function Data() {
    // window.location.href = '/account/login';
  return (
    <>
        ACCESO DENEGADO
    </>
  )
}

export default Data
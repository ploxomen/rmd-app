import apiAxios from '@/axios';
import { verifUser } from '@/helpers/verifUser';
import React from 'react'

export async function getServerSideProps(context) {
    let userCookie = context.req.cookies;
    const {role} = context.params
    // console.log(role,userCookie);

    if(!userCookie.authenticate){
        return {
            redirect : {
                destination: '/account/login',
                permanent:false
            }
        }
    }
    // console.log(first)
    userCookie = JSON.parse(userCookie.authenticate);
    const headers = {'Authorization':'Bearer ' + userCookie.access_token};
    const resp = await apiAxios.get('/module',{headers});
    if(resp.data.redirect !== null){
        return route.replace(resp.data.redirect);
    }
    return {
        props:{}
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
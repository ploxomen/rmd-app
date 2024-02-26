import '@/app/globals.css';
import apiAxios from '@/axios';
import BarDought from '@/components/BarDought';
import BarLine from '@/components/BarLine';
import CartHome from '@/components/CartHome';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import { DocumentChartBarIcon, DocumentCheckIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
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
      const req = await apiAxios.get('/user/modules-roles',{headers,params:{url:'/home'}});
      if(req.data.redirect){
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
    } catch(error) {
        return {
            props:{
              dataModules,
              dataRoles,
              dataUser            
          }
        }
    }
}
export default function Home({dataModules,dataRoles,dataUser}){
    const headers = getCookie();
    const [limit,setLimit] = useState({
        customersCount:0,
        quotationsCount:0,
        quotationsCheckCount:0,
        usersCount:0
    })
    const [charts,setCharts] = useState({
        customersBar:[],
        quotationsBar:[],
        quotationsCheckBar:[],
        productsSale:[]
    })
    useEffect(()=>{
        const getData = async () => {
            try {
                const resp = await apiAxios.get('home/info',{headers});
                setCharts(resp.data.grafics);
                setLimit(resp.data.result);
            } catch (error) {
              console.error(error);
              sweetAlert({title : "Error", text: "Error al obtener los datos", icon : "error"});
            }
        }
        getData();
      },[])
    return(
        <LoyoutIntranet title="Inicio" description="Inicio de la intranet" user={dataUser} modules={dataModules} roles={dataRoles}>
            <div className='grid grid-cols-12 gap-4 mb-6'>
                <CartHome title="Clientes" quantity={limit.customersCount} backgroundIcon="bg-violet-200" Icon={UserGroupIcon} colorIcon="text-violet-500"/>
                <CartHome title="Cotizaciones" quantity={limit.quotationsCount} backgroundIcon="bg-yellow-200" Icon={DocumentChartBarIcon} colorIcon="text-yellow-500"/>
                <CartHome title="Cotizaciones aprobadas" quantity={limit.quotationsCheckCount} backgroundIcon="bg-green-200" Icon={DocumentCheckIcon} colorIcon="text-green-500"/>
                <CartHome title="Usuarios" quantity={limit.usersCount} backgroundIcon="bg-orange-200" Icon={UserIcon} colorIcon="text-orange-500"/>
            </div>
            <div className='p-6 bg-white rounded-md shadow'>
                <div className='grid grid-cols-12 gap-10 mb-6'>
                    <div className='col-span-full lg:col-span-6'>
                    <BarLine data={charts.customersBar} titleLabel="Clientes"/>
                    </div>
                    <div className='col-span-full lg:col-span-6'>
                    <BarLine data={charts.quotationsBar} titleLabel="Cotizaciones"/>
                    </div>
                    <div className='col-span-full lg:col-span-6'>
                    <BarLine data={charts.quotationsCheckBar} titleLabel="Cotizaciones aprobadas"/>
                    </div>
                    <div className='col-span-full lg:col-span-6'>
                    <BarDought data={charts.productsSale} titleLabel="Productos más vendidos"/>
                    </div>
                </div>
            </div>
        </LoyoutIntranet>
    )
}
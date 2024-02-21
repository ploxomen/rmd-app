import '@/app/globals.css';
import apiAxios from "@/axios";
import BanerModule from '@/components/BanerModule';
import { Checkbox } from '@/components/Inputs';
import LoyoutIntranet from "@/components/LoyoutIntranet";
import Modal from '@/components/Modal';
import FormRole from '@/components/roles/FormRole';
import TableRole from '@/components/roles/TableRole';
import { getCookie } from '@/helpers/getCookie';
import { verifUser } from '@/helpers/verifUser';
import { useModal } from '@/hooks/useModal';
import { TYPES, crudRoleInitialState, reducerRoles } from '@/reducers/crudRolesReducer';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';

export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    return await verifUser(userCookie,'/roles');
}
export default function Roles({dataModules,dataRoles,dataUser}){
    const headers = getCookie();
    const route = useRouter();
    const [state,dispatch] = useReducer(reducerRoles,crudRoleInitialState);
    const [dataToEdit, setDataToEdit] = useState(null);
    const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");
    useEffect(()=>{
        const getDataRoles = async () => {
            const headers = getCookie();
            try {
                const resp = await apiAxios.get('/role',{headers});
                if(resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                dispatch({type:TYPES.READ_ALL_ROLES,payload:resp.data.data});
            } catch (error) {
                dispatch({type:TYPES.NO_ROLE});
            }
        }
        getDataRoles();        
    },[])
    const sendData = async (form) => {
        try {
            const resp = form.id ? await apiAxios.put(`/role/${form.id}`,form,{headers}) : await apiAxios.post('/role',form,{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(form.id){
                dispatch({type:TYPES.UPDATE_ROLE,payload:form});
            }else{
                dispatch({type:TYPES.CREATE_ROLE,payload:resp.data.data});
            }
        } catch (error) {
            dispatch({type:TYPES.NO_ROLE});
        }
    }
    const getModules = async (role) => {
        try {
            const resp = await apiAxios.get(`/role-module/${role}`,{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            dispatch({type:TYPES.GET_ROLE_MODULES,payload:{modules:resp.data.data,role}});
            handleOpenModal();
        } catch (error) {
            console.error(error);
            dispatch({type:TYPES.NO_ROLE});
        }
    }
    const closeModal = () => {
        dispatch({type:TYPES.RESET_MODULES});
        handleCloseModal();
    }
    const saveModules = async () => {
        try {
            const resp = await apiAxios.put(`/role-module/${state.idRole}`,{modules:state.modules},{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            alert(resp.data.message);
            closeModal();
        } catch (error) {
            dispatch({type:TYPES.NO_ROLE});
            console.error(error);
        }
    }
    const deleteRole = async (role) => {
        if(!window.confirm("¿Deseas eliminar este rol?")){
            return
        }
        try {
            const resp = await apiAxios.delete(`/role/${role}`,{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(!resp.data.error){
                dispatch({type:TYPES.DELETE_ROLE,payload:role});
            }
            alert(resp.data.message);
        } catch (error) {
            console.error(error);
            dispatch({type:TYPES.NO_ROLE});
        }
    }
    return(
        <>
        <LoyoutIntranet title="Roles" description="Administracion de roles" user={dataUser} modules={dataModules} roles={dataRoles}>
            <BanerModule imageBanner='/baners/Group 13.jpg' title="Administración de roles"/>
            <div className="md:flex flex-wrap gap-4">
                <FormRole dataToEdit={dataToEdit} sendData={sendData} setDataToEdit={setDataToEdit}/>
                <div className='w-full p-6 bg-white rounded-md shadow md:flex-1 overflow-x-auto'>
                    <TableRole roles={state.roles} setDataToEdit={setDataToEdit} getModules={getModules} deleteRole={deleteRole}/>
                </div>
            </div>
        </LoyoutIntranet>
        <Modal title="Lista de módulos" status={modal} handleCloseModal={closeModal} onSave={saveModules}>
            <ul>
            {
                state.modules.map(module => (
                    <li key={module.id}>
                        <Checkbox label={module.module_title} name={"module-"+module.id} checked={module.checked||false} onChange={ e => dispatch({type:TYPES.CHANGE_CHECKED_MODULES,payload:module.id})}/>  
                    </li>
                ))
            }
            </ul>
        </Modal>
        </>
    )
}
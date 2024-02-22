import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule';
import { ButtonPrimary } from '@/components/Buttons';
import { InputSearch } from '@/components/Inputs';
import LoyoutIntranet from '@/components/LoyoutIntranet'
import PaginationTable from '@/components/PaginationTable';
import { SelectPrimary } from '@/components/Selects';
import FormResetPasswordUser from '@/components/users/FormResetPasswordUser';
import FormUser from '@/components/users/FormUser';
import TableUser from '@/components/users/TableUser';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import { verifUser } from '@/helpers/verifUser';
import { useModal } from '@/hooks/useModal';
import workSpace from '@/img/man.png';
import { TYPES_USER, crudUserInitialState, reducerUsers } from '@/reducers/crudUser';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useReducer, useState } from 'react'
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    return await verifUser(userCookie,'/users');
}
const initialFilter = {
    role:"all"
}
const quantityRowData = 25;
function Users({dataModules,dataUser,dataRoles}) {
    const headers = getCookie();
    const route = useRouter();
    const [filter,setFilter] = useState(initialFilter);
    const [state,dispatch] = useReducer(reducerUsers,crudUserInitialState);
    const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");
    const [dataChange,setDataChange] = useState({current:1,search:"",reload:false});
    const [pagination,setPagination] = useState({quantityRowData,totalPages:0});
    const {modal:modelReset,handleOpenModal:handleOpenModalReset,handleCloseModal:handleCloseModalReset} = useModal("hidden");
    useEffect(()=>{
        const getRoles = async () => {
            try {
                const all = await axios.all([
                    apiAxios.get('/role',{headers}),
                    apiAxios.get('/type-documents',{headers})
                ]);
                const respRole = all[0];
                const respTypeDocument = all[1];
                if(respRole.data.redirect !== null){
                    return route.replace(respRole.data.redirect);
                }
                dispatch({
                    type:TYPES_USER.ALL_ROLES_DOCUMENT,
                    payload:{
                        roles:[
                            {id:"all",rol_name:"Todos"},...respRole.data.data
                        ],
                        documents:respTypeDocument.data.data
                    }
                });
            } catch (error) {
                dispatch({type:TYPES_USER.NO_USERS});
            }
        }
        getRoles();
    },[])
    useEffect(()=>{
        const getData = async () => {
            try {
                const resp = await apiAxios.get('/users',{
                    headers,
                    params:{
                        show:pagination.quantityRowData,
                        page:dataChange.current,
                        search:dataChange.search,
                        ...filter
                      }
                });
                if(resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                setPagination({
                    ...pagination,
                    totalPages:resp.data.totalUsers
                })
                dispatch({type:TYPES_USER.ALL_USERS,payload:resp.data.data});
            } catch (error) {
                dispatch({type:TYPES_USER.NO_USERS});
            }
        }
        getData();
    },[filter,dataChange])
    const handleChangeFilter = (e) => {
        setFilter({
            ...filter,
            [e.target.name] : e.target.value
        })
    }
    const saveUser = async (form,roles) => {
        try {
            const resp = form.id ? await apiAxios.put(`/users/${form.id}`,{...form,role:roles},{headers}) : await apiAxios.post('/users',{...form,role:roles},{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});
            }
            setDataChange({
                ...dataChange,
                reload:!dataChange.reload
            })
            sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
            closeModal();
        } catch (error) {
            dispatch({type:TYPES_USER.NO_USERS});
        }
    }
    const getUser = async (idUser) => {
        try {
            const resp = await apiAxios.get(`/users/${idUser}`,{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});
            }
            dispatch({type:TYPES_USER.GET_USER,payload:{roles:resp.data.data.roles,user:resp.data.data.user}});
            handleOpenModal();
        } catch (error) {
            dispatch({type:TYPES_USER.NO_USERS});
            console.error(error);
        }
    }
    const handleChangePage = (number)=>{
        if(!number){
          return
        }
        setDataChange({...dataChange,current:number});
    }
    const closeModal = async () => {
        dispatch({type:TYPES_USER.CLOSE_EDIT});
        handleCloseModal();
    }
    const openModalNew = () => {
        dispatch({type:TYPES_USER.CLOSE_EDIT});
        handleOpenModal();
    }
    const openModalReset = (idUser) => {
        dispatch({type:TYPES_USER.CHANGE_ID_USER,payload:idUser});
        handleOpenModalReset();
    }
    const closeModalReset = () => {
        dispatch({type:TYPES_USER.CLEAR_ID_USER});
        handleCloseModalReset();
    }
    const resetPassword = async (password) => {
        try {
            const resp = await apiAxios.put(`/users-reset/${state.idUser}`,{password},{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});
            }
            sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
            closeModalReset();
        } catch (error) {
            dispatch({type:TYPES_USER.NO_USERS});
            console.error(error);
        }
    }
    const deleteUser = async (idUser) => {
        const question = await sweetAlert({title : "Mensaje", text: "¿Deseas eliminar este usuario?", icon : "question",showCancelButton:true});
        if(!question.isConfirmed){
        r<eturn
        }
        try {
            const resp = await apiAxios.delete(`/users/${idUser}`,{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});
            }
            setDataChange({
                ...dataChange,
                reload:!dataChange.reload
            })
            // dispatch({type:TYPES_USER.DELETE_USER,payload:idUser});
            return sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
        } catch (error) {
            dispatch({type:TYPES_USER.NO_USERS});
            console.error(error);
        }
    }
    let timer;
    const searchCustomer = (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setDataChange({...dataChange,current:1,search:e.target.value});
        }, 500);
    }
  return (
    <>
        <LoyoutIntranet title="Usuarios" description="Administración de usuarios" user={dataUser} modules={dataModules} roles={dataRoles}>
            <BanerModule imageBanner='/baners/Group 17.jpg' title="Administración de usuarios"/>
            <div className='w-full p-6 bg-white rounded-md shadow mb-4'>
                <div className="flex flex-auto">
                    <div className='max-w-48 w-full'>
                        <SelectPrimary name="role" label="Roles" value={filter.role} onChange={handleChangeFilter}>
                        {
                            state.roles.map(role => <option value={role.id} key={role.id}>{role.rol_name}</option>)
                        }
                        </SelectPrimary>
                    </div>
                </div>
            </div>
            <div className='w-full p-6 bg-white rounded-md shadow overflow-x-auto'>
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <ButtonPrimary text="Agregar" icon={<PlusCircleIcon className='w-5 h-5'/>} onClick={e => openModalNew()}/>
                    <div style={{width:"300px"}}>
                        <InputSearch placeholder='¿Que estas buscando?' onInput={searchCustomer}/>
                    </div>
                </div>
                <TableUser users={state.users} getUser={getUser}  modelReset={openModalReset} deleteUser={deleteUser}/>
                <PaginationTable currentPage={dataChange.current} quantityRow={pagination.quantityRowData} totalData={pagination.totalPages} handleChangePage={handleChangePage}/>
            </div>
        </LoyoutIntranet>
        <FormUser rolesData={state.roles} typeDocumentsData={state.typeDocuments} statusModal={modal} saveUser={saveUser} dataUser={state.userEdit} dataUserRol={state.rolesEdit} closeModal={closeModal}/>
        <FormResetPasswordUser statusModalReset={modelReset} closeModal={closeModalReset} resetPassword={resetPassword}/>
    </>
  )
}

export default Users
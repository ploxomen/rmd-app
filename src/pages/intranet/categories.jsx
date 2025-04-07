import '@/app/globals.css';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import { verifUser } from '@/helpers/verifUser';
import React, { useEffect, useReducer, useState } from 'react'
import BanerModule from '@/components/BanerModule';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { InputSearch } from '@/components/Inputs';
import { ButtonPrimary } from '@/components/Buttons';
import TableCategorie from '@/components/categories/TableCategorie';
import apiAxios from '@/axios';
import { TYPES_CATEGORIES, categoriesInitialState, reducerCategories } from '@/reducers/crudCategories';
import { useRouter } from 'next/navigation';
import PaginationTable from '@/components/PaginationTable';
import FormCategorie from '@/components/categories/FormCategorie';
import { useModal } from '@/hooks/useModal';
import { getCookie } from '@/helpers/getCookie';
import { sweetAlert } from '@/helpers/getAlert';

export async function getServerSideProps(context) {
    return await verifUser(context,'/categories');
}
const quantityRowData = 25;
function categories({dataModules,dataUser,dataRoles}) {
    const [state,dispatch] = useReducer(reducerCategories,categoriesInitialState);
    const route = useRouter();
    const headers = getCookie();
    const [dataChange,setDataChange] = useState({current:1,search:"",reload:false});
    const [pagination,setPagination] = useState({quantityRowData,totalPages:0});
    const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");
    useEffect(()=>{
        const getData = async () => {
            try {
                const resp = await apiAxios.get('/categorie',{
                    headers,
                    params:{
                        show:pagination.quantityRowData,
                        page:dataChange.current,
                        search:dataChange.search                      
                    }
                });
                if(resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                setPagination({
                    ...pagination,
                    totalPages:resp.data.totalCategories
                })
                dispatch({type:TYPES_CATEGORIES.ALL_CATEGORIES,payload:resp.data.data});
            } catch (error) {
                dispatch({type:TYPES_CATEGORIES.NO_CATEGORIES});
                console.error(error);
            }
        }
        getData();
    },[dataChange])
    const openModalNew = () => {
        handleOpenModal();
    }
    let timer;
    const searchCategories = (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setDataChange({...dataChange,current:1,search:e.target.value});
        }, 500);
    }
    const getCategorie = async (idUser) => {
        try {
            const resp = await apiAxios.get(`/categorie/${idUser}`,{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});
            }
            dispatch({
                type:TYPES_CATEGORIES.GET_CATEGORIE,
                payload:{
                    categorie:resp.data.data.categorie,
                    subcategories:resp.data.data.subcategories
                }
            });
            handleOpenModal();
        } catch (error) {
            dispatch({type:TYPES_USER.NO_USERS});
            console.error(error);
        }
    }
    const deleteCategorie = async (idCategorie) => {
        if(!window.confirm("¿Deseas eliminar esta categoría?")){
            return
        }
        try {
            const resp = await apiAxios.delete(`/categorie/${idCategorie}`,{headers});
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
            sweetAlert({title : "success", text: resp.data.message, icon : "success"});            ;
        } catch (error) {
            dispatch({type:TYPES_CATEGORIES.NO_CATEGORIES});
        }
    }
    const handleChangePage = (number)=>{
        if(!number){
          return
        }
        setDataChange({...dataChange,current:number});
    }
    const closeModal = async () => {
        dispatch({type:TYPES_CATEGORIES.RESET_EDIT});
        handleCloseModal();
    }
    const saveCategorie = async (form,subcategories) => {
        try {
            const resp = form.id ? await apiAxios.put(`/categorie/${form.id}`,{...form,subcategories},{headers}) : await apiAxios.post('/categorie',{...form,subcategories},{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                resp.data.data.forEach(error => {
                    sweetAlert({title : "Alerta", text: error, icon : "warning"});
                });
                return
            }
            setDataChange({
                ...dataChange,
                reload:!dataChange.reload
            })
            sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});            ;
            closeModal();
        } catch (error) {
            console.error(error);
            dispatch({type:TYPES_CATEGORIES.NO_CATEGORIES});
        }
    }
  return (
    <>
    <LoyoutIntranet title="Categorias" description="Administración de categorías" user={dataUser} modules={dataModules} roles={dataRoles}>
        <BanerModule imageBanner='/baners/Group 10.jpg' title="Administración de categorías"/>
        <div className='w-full p-6 bg-white rounded-md shadow overflow-x-auto'>
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <ButtonPrimary text="Agregar" icon={<PlusCircleIcon className='w-5 h-5'/>} onClick={e => openModalNew()}/>
                <div style={{width:"300px"}}>
                    <InputSearch placeholder='¿Que estas buscando?' onInput={searchCategories}/>
                </div>
            </div>
            <div className="overflow-x-auto mb-4">
            <TableCategorie categories={state.categories} getCategorie={getCategorie} deleteCategorie={deleteCategorie}/>
            </div>
            <PaginationTable currentPage={dataChange.current} quantityRow={pagination.quantityRowData} totalData={pagination.totalPages} handleChangePage={handleChangePage}/>
        </div>
    </LoyoutIntranet>
    <FormCategorie statusModal={modal} categorieEdit={state.categorieEdit} closeModal={closeModal} subCategoriesEdit={state.subcategoriesEdit} handleSave={saveCategorie}/>
    </>
  )
}

export default categories
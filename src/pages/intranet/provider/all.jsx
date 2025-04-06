import React, { useEffect, useReducer, useState } from 'react'
import '@/app/globals.css';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import { verifUser } from '@/helpers/verifUser';
import { TYPES_CUSTOMERS, customersIntialState, reducerCustomers } from '@/reducers/crudCustomers';
import BanerModule from '@/components/BanerModule';
import { ButtonPrimary } from '@/components/Buttons';
import {PlusCircleIcon } from '@heroicons/react/24/solid';
import apiAxios from '@/axios';
import { getCookie } from '@/helpers/getCookie';
import axios from 'axios';
import { useModal } from '@/hooks/useModal';
import { InputSearch } from '@/components/Inputs';
import PaginationTable from '@/components/PaginationTable';
import { useRouter } from 'next/navigation';
import { sweetAlert } from '@/helpers/getAlert';
import FormProvider from '@/components/providers/FormProvider';
import TableProvider from '@/components/providers/TableProvider';

export async function getServerSideProps(context) {
  return await verifUser(context,'/customers');
}
const quantityRowData = 25;
function customers({dataModules,dataUser,dataRoles}) {
  const [state,dispatch] = useReducer(reducerCustomers,customersIntialState);
  const route = useRouter();
  const [dataChange,setDataChange] = useState({current:1,search:"",reload:false});
  const [pagination,setPagination] = useState({quantityRowData,totalPages:0});
  const headers = getCookie();
  const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");
  useEffect(()=>{
    const getData = async () => {
        try {
            const all = await axios.all([
                apiAxios.get('/departaments',{headers}),
                apiAxios.get('/type-documents',{headers}),
                apiAxios.get('/contries',{headers}),
            ]);
            const respDepartaments = all[0];
            const respTypeDocument = all[1];
            const respContries = all[2];
            dispatch({
                type:TYPES_CUSTOMERS.ALL_DEPARTAMENTS_DOCUMENTS,
                payload:{
                    departaments:respDepartaments.data.data,
                    documents:respTypeDocument.data.data,
                    contries:respContries.data.data
                }
            });
        } catch (error) {
          dispatch({type:TYPES_CUSTOMERS.NO_CUSTOMERS});
          sweetAlert({title : "Error", text: "Error al obtener los tipos de documentos o departamentos", icon : "error"});
        }
    }
    getData();
  },[])
  useEffect(()=>{
    const getData = async () => {
      try {
          const resp = await apiAxios.get('/provider',{
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
            totalPages:resp.data.totalCustomers
          })
          dispatch({
              type:TYPES_CUSTOMERS.ALL_CUSTOMERS,
              payload:resp.data.data
          });
      } catch (error) {
          dispatch({type:TYPES_CUSTOMERS.NO_CUSTOMERS});
          sweetAlert({title : "Error", text: "Error al obtener los proveedors", icon : "error"});
      }
    }
    getData();
  },[dataChange])
  const handleSaveCustomer = async (form,contacts) =>{
    try {
        const resp = !form.id ? await apiAxios.post('/provider',{...form,contacts},{headers}) : await apiAxios.put('/provider/'+form.id,{...form,contacts},{headers});
        if(resp.data.redirect !== null){
          return route.replace(resp.data.redirect);
        }
        if(resp.data.error){
            return sweetAlert({title : "Error", text: resp.data.message, icon : "error"});            ;
        }
        setDataChange({
          ...dataChange,
            reload:!dataChange.reload
        })
        sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
        closeModal();
    } catch (error) {
        console.error(error)
        sweetAlert({title : "Error", text: "Error alguardar los datos del proveedor", icon : "error"});
    }
  }
  const getCustomer = async (idCustomer) => {
    try {
        const resp = await apiAxios.get(`/provider/${idCustomer}`,{headers});
        if(resp.data.redirect !== null){
            return route.replace(resp.data.redirect);
        }
        if(resp.data.error){
          return sweetAlert({title : "Error", text: resp.data.message, icon : "error"});            ;
        }
        const customer = resp.data.data;
        dispatch({
            type: TYPES_CUSTOMERS.GET_CUSTOMER,
            payload: customer
        });
        handleOpenModal();
    } catch (error) {
        dispatch({type:TYPES_CUSTOMERS.NO_CUSTOMERS});
        console.error(error);
        sweetAlert({title : "Error", text: "Error al obtener al proveedor", icon : "error"});            ;
    }
  }
  const closeModal = async () => {
    dispatch({type:TYPES_CUSTOMERS.CLOSE_EDIT});
    handleCloseModal();
  }
  const handleChangePage = (number)=>{
    if(!number){
      return
    }
    setDataChange({...dataChange,current:number});
  }
  const handleDeleteCustomer = async (idCustomer) => {
    const question = await sweetAlert({title : "Mensaje", text: "¿Deseas eliminar este proveedor?", icon : "question",showCancelButton:true});
    if(!question.isConfirmed){
      return
    }
    try {
        const resp = await apiAxios.delete(`/provider/${idCustomer}`,{headers});
        if(resp.data.redirect !== null){
            return route.replace(resp.data.redirect);
        }
        if(resp.data.error){
          return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});            ;
        }
        setDataChange({
          ...dataChange,
          reload:!dataChange.reload
        })
        return sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});            ;
    } catch (error) {
        dispatch({type:TYPES_CUSTOMERS.NO_CUSTOMERS});
        console.error(error);
    }
  }
  let timer = null;
  const searchCustomer = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setDataChange({...dataChange,current:1,search:e.target.value});
    }, 500);
  }
  return (
    <>
      <LoyoutIntranet title="proveedors" description="Administración de proveedores" user={dataUser} modules={dataModules} roles={dataRoles}>
          <BanerModule imageBanner='/baners/Group 12.jpg' title="Administración de proveedores"/>
          <div className='w-full p-6 bg-white rounded-md shadow'>
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div>
                  <ButtonPrimary text="Agregar" icon={<PlusCircleIcon className='w-5 h-5'/>} onClick={handleOpenModal}/>
                </div>
                <div style={{width:"300px"}}>
                  <InputSearch placeholder='¿Que estas buscando?' onInput={searchCustomer}/>
                </div>
              </div>
              <div className="overflow-x-auto mb-4">
                <TableProvider customers={state.customers} getCustomer={getCustomer} deleteCustomer={handleDeleteCustomer}/>
              </div>
              <PaginationTable currentPage={dataChange.current} quantityRow={pagination.quantityRowData} totalData={pagination.totalPages} handleChangePage={handleChangePage}/>
          </div>
      </LoyoutIntranet>
      <FormProvider closeModal={closeModal} contries={state.contries} typeDocumentsData={state.typeDocuments} statusModal={modal} customerEdit={state.customerEdit} contactsEdit={state.customerContactsEdit} pronvincesData={state.provinces} districtsData={state.districts} departamentsData={state.departaments} handleSaveCustomer={handleSaveCustomer}/>
    </>
  )
}

export default customers
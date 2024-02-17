import React, { useEffect, useReducer, useState } from 'react'
import '@/app/globals.css';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import { verifUser } from '@/helpers/verifUser';
import { TYPES_CUSTOMERS, customersIntialState, reducerCustomers } from '@/reducers/crudCustomers';
import BanerModule from '@/components/BanerModule';
import workSpace from '@/img/client.png';
import { ButtonPrimary } from '@/components/Buttons';
import {PlusCircleIcon } from '@heroicons/react/24/solid';
import TableCustomer from '@/components/customers/TableCustomer';
import apiAxios from '@/axios';
import { getCookie } from '@/helpers/getCookie';
import axios from 'axios';
import FormCustomer from '@/components/customers/FormCustomer';
import { useModal } from '@/hooks/useModal';
import { InputSearch } from '@/components/Inputs';
import PaginationTable from '@/components/PaginationTable';
import { useRouter } from 'next/navigation';

export async function getServerSideProps(context) {
  const userCookie = context.req.cookies;
  return await verifUser(userCookie,'/customers');
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
          alert('Error al obtener los tipos de documentos o departamentos');
        }
    }
    getData();
  },[])
  useEffect(()=>{
    const getData = async () => {
      try {
          const resp = await apiAxios.get('/customer',{
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
          alert('Error al obtener los clientes');
      }
    }
    getData();
  },[dataChange])
  const handleSaveCustomer = async (form,contacts) =>{
    try {
        const resp = !form.id ? await apiAxios.post('/customer',{...form,contacts},{headers}) : await apiAxios.put('/customer/'+form.id,{...form,contacts},{headers});
        if(resp.data.redirect !== null){
          return route.replace(resp.data.redirect);
        }
        if(resp.data.error){
            return alert(resp.data.message);
        }
        setDataChange({
          ...dataChange,
            reload:!dataChange.reload
        })
        alert(resp.data.message);
        closeModal();
    } catch (error) {
        console.error(error)
        alert("Error al guardar los datos del cliente");
    }
  }
  const getCustomer = async (idCustomer) => {
    try {
        const resp = await apiAxios.get(`/customer/${idCustomer}`,{headers});
        if(resp.data.redirect !== null){
            return route.replace(resp.data.redirect);
        }
        if(resp.data.error){
            return alert(resp.data.message);
        }
        const customer = resp.data.data;
        dispatch({
            type:TYPES_CUSTOMERS.GET_CUSTOMER,
            payload:customer
        });
        handleOpenModal();
    } catch (error) {
        dispatch({type:TYPES_CUSTOMERS.NO_CUSTOMERS});
        console.error(error);
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
    if(!window.confirm("¿Deseas eliminar este cliente?")){
      return
    }
    try {
        const resp = await apiAxios.delete(`/customer/${idCustomer}`,{headers});
        if(resp.data.redirect !== null){
            return route.replace(resp.data.redirect);
        }
        if(resp.data.error){
            return alert(resp.data.message);
        }
        setDataChange({
          ...dataChange,
          reload:!dataChange.reload
        })
        return alert(resp.data.message);
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
      <LoyoutIntranet title="Clientes" description="Administración de clientes" user={dataUser} modules={dataModules} roles={dataRoles}>
          <BanerModule imageBanner={workSpace} title="Administración de clientes"/>
          <div className='w-full p-6 bg-white rounded-md shadow overflow-x-auto'>
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div>
                  <ButtonPrimary text="Agregar" icon={<PlusCircleIcon className='w-5 h-5'/>} onClick={handleOpenModal}/>
                </div>
                <div style={{width:"300px"}}>
                  <InputSearch placeholder='¿Que estas buscando?' onInput={searchCustomer}/>
                </div>
              </div>
              <TableCustomer customers={state.customers} getCustomer={getCustomer} deleteCustomer={handleDeleteCustomer}/>
              <PaginationTable currentPage={dataChange.current} quantityRow={pagination.quantityRowData} totalData={pagination.totalPages} handleChangePage={handleChangePage}/>
          </div>
      </LoyoutIntranet>
      <FormCustomer closeModal={closeModal} contries={state.contries} typeDocumentsData={state.typeDocuments} statusModal={modal} customerEdit={state.customerEdit} contactsEdit={state.customerContactsEdit} pronvincesData={state.provinces} districtsData={state.districts} departamentsData={state.departaments} handleSaveCustomer={handleSaveCustomer}/>
    </>
  )
}

export default customers
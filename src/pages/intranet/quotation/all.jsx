import '@/app/globals.css';
import apiAxios from '@/axios';
import Badge from '@/components/Badge';
import BanerModule from '@/components/BanerModule';
import { InputSearch } from '@/components/Inputs';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import PaginationTable from '@/components/PaginationTable';
import { SelectPrimary } from '@/components/Selects';
import FormQuotation from '@/components/quotations/FormQuotation';
import TableAllQuotation from '@/components/quotations/TableAllQuotation';
import { getCookie } from '@/helpers/getCookie';
import { verifUser } from '@/helpers/verifUser';
import { useModal } from '@/hooks/useModal';
import workSpace from '@/img/checklist.png';
import { TYPES_QUOTATIONS, quotationInitialState, reducerQuotations } from '@/reducers/crudQuotations';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import React, { useEffect, useReducer, useState } from 'react'
export async function getServerSideProps(context){
  const userCookie = context.req.cookies;
  return await verifUser(userCookie,'/quotation/all');
}
const initialStateFilters = {
  products:[],
  customers:[],
  users:[],
  status:[
    {
      value:"0",
      label:"Anulado",
      element:<Badge text="Anulado" colors="text-red-500 bg-red-100" />
    },
    {
      value:"1",
      label:"Generado",
      element:<Badge text="Generado" colors="text-green-500 bg-green-100" />
    },
    {
      value:"2",
      label:"En pedido",
      element:<Badge text="En pedido" colors="text-blue-500 bg-blue-100" />
    }
  ]
}
const initialStateValueFilters = {
  customer:"",
  status:"",
  quoter:"",
  current:1,
  search:"",
  reload:false
}
const quantityRowData = 25;

function All({nameUser,dataModules,dataRoles}) {
  const headers = getCookie();
  const route = useRouter();
  const [filters,setFilters] = useState(initialStateFilters);
  const [dataChange,setDataChange] = useState(initialStateValueFilters);
  const [pagination,setPagination] = useState({quantityRowData,totalPages:0});
  const [state,dispatch] = useReducer(reducerQuotations,quotationInitialState);
  const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");

  useEffect(()=>{
    const getData = async () => {
        try {
            const all = await axios.all([
                apiAxios.get('/quotation-extra/products',{headers}),
                apiAxios.get('/quotation-extra/customers',{headers}),
                apiAxios.get('/quotation-extra/users',{headers})
            ]);
            setFilters({
              ...filters,
              products: all[0].data.data,
              customers: all[1].data.data,
              users:all[2].data.data
            })
        } catch (error) {
            alert('Error al obtener los filtros')
        }
    }
    getData();
  },[])

  useEffect(()=>{
    const getData = async () => {
      try {
          const resp = await apiAxios.get('/quotation',{
            headers,
            params:{
              show:pagination.quantityRowData,
              page:dataChange.current,
              search:dataChange.search,
              status:dataChange.status,
              quoter:dataChange.quoter,
              customer:dataChange.customer
            }
          });
          if(resp.data.redirect !== null){
              return route.replace(resp.data.redirect);
          }
          setPagination({
            ...pagination,
            totalPages:resp.data.totalQuotations
          })
          dispatch({
              type:TYPES_QUOTATIONS.ALL_QUOTATIONS,
              payload:resp.data.data
          });
      } catch (error) {
          dispatch({type:TYPES_QUOTATIONS.NO_QUOTATION});
          alert('Error al obtener las cotizaciones');
      }
    }
    getData();
  },[dataChange])
  const getQuotation = async (idQuotation) => {
    try {
      const resp = await apiAxios.get(`/quotation/${idQuotation}`,{headers});
      if(resp.data.redirect !== null){
          return route.replace(resp.data.redirect);
      }
      if(resp.data.error){
          return alert(resp.data.message);
      }
      const data = resp.data.data;
      dispatch({
          type:TYPES_QUOTATIONS.GET_QUOTATION,
          payload:{
            quotation : data.quotation,
            contacs : data.contacs,
            products : data.products
          }
      });
      handleOpenModal();
    } catch (error) {
        dispatch({type:TYPES_QUOTATIONS.NO_QUOTATION});
        console.log(error);
    }
  }

  const deleteQuotation = async (idQuotation) => {
    if(!window.confirm("¿Deseas anular esta cotización?")){
      return
    }
    try {
        const resp = await apiAxios.delete(`/quotation/${idQuotation}`,{headers});
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
        alert('Error al eliminar la cotización');
        dispatch({type:TYPES_QUOTATIONS.NO_QUOTATION});
        console.log(error);
    }
  }
  let timer = null;
  const handleChangeFilter = (column,value) => {
    if(column == 'search'){
      clearTimeout(timer);
      timer = setTimeout(() => {
        setDataChange({...dataChange,current:1,search:value});
      }, 500);
      return
    }
    setDataChange({
      ...dataChange,
      [column] : value
    })
  }
  const handleChangePage = (number)=>{
    if(!number){
      return
    }
    setDataChange({...dataChange,current:number});
  }
  const handleSaveModalForm = () => {
    dispatch({type:TYPES_QUOTATIONS.CLOSE_QUOTATION});
    handleCloseModal();
    setDataChange({
      ...dataChange,
      reload:!dataChange.reload
    })
  }
  const handleCloseModalForm = () => {
    dispatch({type:TYPES_QUOTATIONS.CLOSE_QUOTATION});
    handleCloseModal();
  }
    return (
      <>
      <LoyoutIntranet title="Mis cotizaciones" description="Administración de cotizaciones" names={nameUser} modules={dataModules} roles={dataRoles}>
          <BanerModule imageBanner={workSpace} title="Administración de cotizaciones"/>
          <div className='w-full p-6 bg-white rounded-md shadow mb-4 grid grid-cols-6 gap-x-2'>
              <div className='col-span-2'>
                <SelectPrimary name="customer" label="Clientes" value={dataChange.customer} onChange={e => handleChangeFilter(e.target.name,e.target.value)}>
                  <option value="">Todos</option>
                  {
                      filters.customers.map(customer => <option value={customer.value} key={customer.value}>{customer.label}</option>)
                  }
                </SelectPrimary>
              </div>
              <div className='col-span-2'>
                <SelectPrimary name="quoter" label="Cotizador" value={dataChange.quoter} onChange={e => handleChangeFilter(e.target.name,e.target.value)}>
                  <option value="">Todos</option>
                  {
                      filters.users.map(user => <option value={user.id} key={user.id}>{user.user_name + ' ' + user.user_last_name}</option>)
                  }
                </SelectPrimary>
              </div>
              <div className='col-span-2'>
                <SelectPrimary name="status" label="Estado" value={dataChange.status} onChange={e => handleChangeFilter(e.target.name,e.target.value)}>
                  <option value="">Todos</option>
                  {
                      filters.status.map(stat => <option value={stat.value} key={stat.value}>{stat.label}</option>)
                  }
                </SelectPrimary>
              </div>
          </div>
          <div className='w-full p-6 bg-white rounded-md shadow overflow-x-auto'>
              <div style={{width:"300px"}} className='ml-auto'>
                <InputSearch placeholder='¿Que estas buscando?' onInput={e => handleChangeFilter('search',e.target.value)}/>
              </div>
              <TableAllQuotation quotations={state.quotations} deleteQuotation={deleteQuotation} getQuotation={getQuotation} status={filters.status}/>
              <PaginationTable currentPage={dataChange.current} quantityRow={pagination.quantityRowData} totalData={pagination.totalPages} handleChangePage={handleChangePage}/>
          </div>
      </LoyoutIntranet>
      <FormQuotation statusModal={modal} handleCloseModal={handleCloseModalForm} handleSaveModalForm={handleSaveModalForm} customers={filters.customers} contactsList={state.contactsEdit} productsList={filters.products} productDetails={state.productsDetails} quotationEdit={state.quotationEdit}/>
      </>
    )
}

export default All
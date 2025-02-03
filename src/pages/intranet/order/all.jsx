import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule'
import { InputPrimary, InputSearch } from '@/components/Inputs';
import LoyoutIntranet from '@/components/LoyoutIntranet'
import PaginationTable from '@/components/PaginationTable';
import { SelectPrimary } from '@/components/Selects';
import FormOrder from '@/components/orders/FormOrder';
import TableOrderAll from '@/components/orders/TableOrderAll';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import { statusOrders } from '@/helpers/statusQuotations';
import { parseMoney } from '@/helpers/utilities';
import { verifUser } from '@/helpers/verifUser';
import { useModal } from '@/hooks/useModal';
import { TYPES_ORDERS, ordersInitialReducer, reducerOrders } from '@/reducers/crudOrders';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useReducer, useState } from 'react'
let monthBefore = new Date();
monthBefore.setMonth(new Date().getMonth() - 1);
const initialStateFilters = {
    customers:[],
    status:statusOrders,
}
const initialStateValueFilters = {
    customer:"",
    status:"",
    date_ini: new Date().toISOString().split("T")[0],
    date_fin : monthBefore.toISOString().split("T")[0],
    current:1,
    search:"",
    reload:false
}
const quantityRowData = 20;
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    return await verifUser(userCookie,'/order/all');
}
const amountsInitial = {
    total: 0,
    igv: 0,
    amount: 0
}
function OrderAll({dataUser,dataModules,dataRoles}) {
    const [filters,setFilters] = useState(initialStateFilters);
    const [amounts,setAmounts] = useState(amountsInitial);
    const [state,dispatch] = useReducer(reducerOrders,ordersInitialReducer);
    const [dataChange,setDataChange] = useState(initialStateValueFilters);
    const [pagination,setPagination] = useState({quantityRowData,totalPages:0});
    const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");
    const [departaments, setDepartaments] = useState([]);
    const route = useRouter();
    const headers = getCookie();
    useEffect(() => {
        const getData = async () => {
          try {
            const all = await axios.all([
                apiAxios.get('/departaments', { headers }),
                apiAxios.get('/quotation-extra/customers', { headers }),
            ]);
            setDepartaments(all[0].data.data);
            setFilters({
                ...filters,
                customers: all[1].data.data
            });
          } catch (error) {
            console.log(error);
            sweetAlert({title : "Error", text: "Error al obtener de clientes y departamentos", icon : "error"});
          }
        }
        getData();
    },[]);
    useEffect(()=>{
        const getData = async () => {
          try {
              const resp = await apiAxios.get('/order',{
                headers,
                params:{
                  show:pagination.quantityRowData,
                  page:dataChange.current,
                  ...dataChange
                }
              });
              if(resp.data.redirect !== null){
                  return route.replace(resp.data.redirect);
              }
              setPagination({
                ...pagination,
                totalPages:resp.data.totalOrders
              })
              const {igv,amount,total} = resp.data
              setAmounts({igv,amount,total});
              dispatch({
                  type:TYPES_ORDERS.ALL_ORDERS,
                  payload:resp.data.data
              });
          } catch (error) {
              sweetAlert({title : "Error", text: "Error al obtener las ordenes", icon : "error"});
          }
        }
        getData();
    },[dataChange])
    const handleChangeFilter = async (e) => {
        setDataChange({
          ...dataChange,
          [e.target.name] : e.target.value
        })
    }
    let timer = null;
    const searchCustomer = (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
        setDataChange({...dataChange,current:1,search:e.target.value});
        }, 500);
    }
    const handleChangePage = (number)=>{
        if(!number){
          return
        }
        setDataChange({...dataChange,current:number});
    }
    const deleteOrder = async (id) => {
        const question = await sweetAlert({title : "Mensaje", text: "¿Deseas eliminar este pedido?", icon : "question",showCancelButton:true});
        if(!question.isConfirmed){
          return
        }
        try {
            const resp = await apiAxios.delete(`/order/${id}`,{headers});
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
            sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});            ;
        } catch (error) {
            dispatch({type:TYPES_ORDERS.NO_ORDERS});
            console.error(error);
            sweetAlert({title : "Error", text: "Error al eliminar el pedido", icon : "error"});            ;
        }
    }
    const getOrder = async (id) => {
        try {
            const resp = await apiAxios.get(`/order/${id}`,{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
              return sweetAlert({title : "Error", text: resp.data.message, icon : "error"});            ;
            }
            dispatch({
                type:TYPES_ORDERS.GET_ORDER,
                payload:{
                    order:resp.data.data.order,
                    quotations:resp.data.data.quotations,
                    provinces:resp.data.data.provinces,
                    districs:resp.data.data.districs,
                    quotationsNew: resp.data.data.quotationsNew
                }
            });
            handleOpenModal();
        } catch (error) {
            dispatch({type:TYPES_ORDERS.NO_ORDERS});
            console.error(error);
            sweetAlert({title : "Error", text: "Error al obtener el pedido", icon : "error"});
        }
    }
    const closeModal = async () => {
        dispatch({type:TYPES_ORDERS.CLOSE_EDIT});
        handleCloseModal();
    }
    const handleSaveModalClose = () => {
        setDataChange({
            ...dataChange,
            reload:!dataChange.reload
        })
        handleCloseModal();
    }
  return (
    <>
        <LoyoutIntranet title="Mis pedidos" description="Mis pedidos" user={dataUser} modules={dataModules} roles={dataRoles}>
            <BanerModule imageBanner='/baners/Group 17.jpg' title="Administración de pedidos"/>
            <div className='w-full p-6 bg-white rounded-md shadow mb-4 grid grid-cols-12 gap-x-3 gap-y-0'>
                <div className="col-span-full md:col-span-6 lg:col-span-3">
                    <SelectPrimary label="Clientes" name="customer" value={dataChange.customer||''} onChange={handleChangeFilter}>
                        <option value="">Todos</option>

                        {
                            filters.customers.map(customer => <option key={customer.value} value={customer.value}>{customer.label}</option>)
                        }
                    </SelectPrimary>
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-3">
                    <SelectPrimary label="Estado" name="status" value={dataChange.status||''} onChange={handleChangeFilter}>
                        <option value="">Todos</option>
                        {
                            filters.status.map(status => <option key={status.value} value={status.value}>{status.label}</option>)
                        }
                    </SelectPrimary>
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-3">
                    <InputPrimary label='Fecha Inicio' type='date' inputRequired='required' name='date_ini' value={dataChange.date_ini} onChange={handleChangeFilter} />
                </div>
                <div className="col-span-full md:col-span-6 lg:col-span-3">
                    <InputPrimary label='Fecha Fin' type='date' inputRequired='required' name='date_fin' value={dataChange.date_fin} onChange={handleChangeFilter} />
                </div>
            </div>
            <div className='w-full p-6 bg-white rounded-md shadow'>
                <div className='flex gap-3 mb-4 flex-wrap justify-center'>
                    <div className='px-4 py-2 border-t-4 border-indigo-300 text-center bg-slate-50'>
                        <span className='block text-xs text-slate-500'>Subtotal</span>
                        <span className='font-semibold text-sm text-slate-600'>{parseMoney(amounts.amount,'PEN')}</span>
                    </div>
                    <div className='px-4 py-2 border-t-4 border-red-300 text-center bg-slate-50'>
                        <span className='block text-xs text-slate-500'>I.G.V</span>
                        <span className='font-semibold text-sm text-slate-600'>{parseMoney(amounts.igv,'PEN')}</span>
                    </div>
                    <div className='px-4 py-2 border-t-4 border-blue-300 text-center bg-slate-50'>
                        <span className='block text-xs text-slate-500'>Total</span>
                        <span className='font-semibold text-sm text-slate-600'>{parseMoney(amounts.total,'PEN')}</span>
                    </div>
                </div>
                <div style={{width:"300px"}} className='mb-4 ml-auto'>
                    <InputSearch placeholder='¿Que estas buscando?' onInput={searchCustomer}/>
                </div>
                <div className='overflow-x-auto overflow-y-hidden'>
                    <TableOrderAll orders={state.orders} deleteOrder={deleteOrder} getOrder={getOrder} status={filters.status}/>
                </div>
                <PaginationTable currentPage={dataChange.current} quantityRow={pagination.quantityRowData} totalData={pagination.totalPages} handleChangePage={handleChangePage}/>
            </div>
        </LoyoutIntranet>
        <FormOrder statusModal={modal} quotationsNew={state.quotationsNew} departaments={departaments} districsAll={state.districs} provincesAll={state.provinces} customers={filters.customers} orderEdit={state.orderEdit} quotationsEdit={state.quotationsEdit} handleCloseModal={closeModal} handleSaveModalClose={handleSaveModalClose}/>
    </>
  )
}

export default OrderAll
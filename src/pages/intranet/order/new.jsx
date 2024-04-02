import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule';
import LoyoutIntranet from '@/components/LoyoutIntranet'
import { SelectPrimary } from '@/components/Selects';
import { verifUser } from '@/helpers/verifUser';
import React, { useEffect, useRef, useState } from 'react'
import { getCookie } from '@/helpers/getCookie';
import TableOrder from '@/components/orders/TableOrder';
import { sweetAlert } from '@/helpers/getAlert';
import SeccionForm from '@/components/SeccionForm';
import { ButtonPrimary } from '@/components/Buttons';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import EditorText from '@/components/EditorText';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    return await verifUser(userCookie,'/order/new');
}
const initialFilter = {
  money:"PEN",
  customer:"",
  reload:false
}
function OrderNew({dataUser,dataModules,dataRoles}) {
  const [customers,setCustomers] = useState([]);
  const [includeIgv,setIncludeIgv] = useState(1);
  const [quotations,setQuotations] = useState([]);
  const route = useRouter();
  const refDetailsAditional = useRef(null);
  const selectAllQuotations = quotations.length > 0 && quotations.filter(quotation => quotation.checked == 1).length == quotations.length
  const [filter,setFilter] = useState(initialFilter);
  const headers = getCookie();
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiAxios.get('/quotation-extra/customers',{headers});
        setCustomers(response.data.data); 
      } catch (error) {
        sweetAlert({title : "Error", text: "Error al obtener los clientes", icon : "error"});
      }
    }
    getData();
  },[]);
  useEffect(() => {
    const getData = async () => {
      if(filter.customer == ""){
        setQuotations([]);
        setIncludeIgv(1);
        return
      }
      try {
        const resq = await apiAxios.get('order-extra/quotations',{params : filter,headers});
        setQuotations(resq.data.data);
        setIncludeIgv(resq.data.includeIgv);
      } catch (error) {
        sweetAlert({title : "Error", text: "Error al obtener las cotizaciones", icon : "error"});
      }
    }
    getData();
  },[filter])
  const handleChangeFilter = async (e) => {
    setFilter({
      ...filter,
      [e.label ? 'customer' : e.target.name] : e.label ? e.value : e.target.value
    })
  }
  const handleSelectAll = () => {
    setQuotations(quotations.map(quotation => ({...quotation,checked : quotation.checked === 1 ? 0 : 1})));
  }
  const handleCheck = (id) => {
    setQuotations(quotations.map(quotation => quotation.id == id ? {...quotation,checked : quotation.checked === 1 ? 0 : 1} : quotation));
  }
  const handleSubmit = async (e) => {
    const quotationsNew = quotations.filter(quotation => quotation.checked == 1);
    if(!quotationsNew.length){
      return sweetAlert({title : "Alerta", text: "Debe elegir al menos una cotización", icon : "warning"});
    }
    const question = await sweetAlert({title : "Mensaje", text: "¿Deseas generar un nuevo pedido?", icon : "question",showCancelButton:true});
    if(!question.isConfirmed){
      return
    }
    try {
      const resp = await apiAxios.post('order',{...filter,includeIgv,quotations:quotationsNew,orderDetails:refDetailsAditional.current.getContent()},{headers});
      if(resp.data.redirect !== null){
        return route.replace(resp.data.redirect);
      }
      sweetAlert({title : "Exitoso", text: "Peidido generado correctamente", icon : "success"});
      setFilter({
        ...filter,
        reload:!filter.reload
      })
      refDetailsAditional.current.setContent("");
    } catch (error) {
      console.error(error);
      sweetAlert({title : "Error", text: "Error al generar un nuevo pedido", icon : "error"});
    }
  }
  return (
    <LoyoutIntranet title="Nuevo pedido" description="Creaciones de nuevos pedidos" user={dataUser} modules={dataModules} roles={dataRoles}>
      <BanerModule imageBanner='/baners/Group 15.jpg' title="Nuevo pedido"/>
      <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
        <div className="col-span-full md:col-span-6">
          <label htmlFor="customer" className="text-placeholder text-sm mb-1 block dark:text-white">Cliente<span className="text-red-500 font-bold pl-1">*</span></label>
        <Select instanceId='customer' placeholder="Seleccione un cliente" name='customer' options={customers} onChange={handleChangeFilter} menuPosition='fixed'/>
        </div>
        <div className="col-span-full md:col-span-4 lg:col-span-3">
          <SelectPrimary label="Tipo moneda" inputRequired='required' name="money" value={filter.money||''} onChange={handleChangeFilter}>
              <option value="PEN">Soles (S/)</option>
              <option value="USD">Dolares ($)</option>
          </SelectPrimary>
        </div>
        <div className="col-span-full">
          {
            !includeIgv && <p className='text-sm text-red-600 my-2'>Solo se visualizan las cotizaciones sin IGV debido a que el cliente <strong className='font-bold'>NO ES DE PERÚ</strong></p>
          }
        </div>
      </div>
      <div className='w-full p-6 bg-white rounded-md shadow overflow-x-auto mb-4'>
        <SeccionForm title="Lista de cotizaciones"/>
        <TableOrder quotations={quotations} typeMoney={filter.money} selectQuotation={selectAllQuotations} changeChecked={handleCheck} changeAll={handleSelectAll}/>
      </div>
      <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
        <div className="col-span-full">
          <SeccionForm title="Datos adicionales"/>
        </div>
        <div className="col-span-full mb-2">
          <EditorText label="Detalles adicionales" id="quotation_details_aditional" editorRef={refDetailsAditional}/>
        </div>
        <div className="col-span-full text-center">
          <ButtonPrimary text="Generar" icon={<PaperAirplaneIcon className='w-5 h-5'/>} onClick={handleSubmit}/>
        </div>
      </div>
    </LoyoutIntranet>
  )
}

export default OrderNew
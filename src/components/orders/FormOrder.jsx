import React, { useEffect, useRef, useState } from 'react'
import { InputPrimary, SubmitForm } from '../Inputs';
import EditorText from '../EditorText';
import SeccionForm from '../SeccionForm';
import { SelectPrimary } from '../Selects';
import Modal from '../Modal';
import TableOrderEdit from './TableOrderEdit';
import { sweetAlert } from '@/helpers/getAlert';
import apiAxios from '@/axios';
import { getCookie } from '@/helpers/getCookie';
import { useRouter } from 'next/navigation';

const initalForm = {
    id:null,
    order_customer:"",
    order_igv:0,
    order_date_issue:"",
    order_money:"",
    order_details:""
}

function FormOrder({statusModal,orderEdit,quotationsEdit,handleCloseModal,handleSaveModalClose}) {
    const [form,setForm] = useState({});
    const [quotations,setQuotations] = useState([]);
    const refOrderDetails = useRef(null);
    const route = useRouter();
    const headers = getCookie();
    useEffect(()=>{
        setForm(Object.keys(orderEdit).length ? orderEdit : initalForm);
    },[orderEdit])
    useEffect(()=>{
        setQuotations(quotationsEdit.length ? quotationsEdit : []);
    },[quotationsEdit])
    const handleDelete = (id) => {
        const quotationsDelete = quotations.filter(quotation => quotation.close === 1).length;
        if(quotationsDelete === (quotations.length - 1)){
            return sweetAlert({title : "Alerta", text: "El pedido debe contener al menos una cotización", icon : "warning"});            ;
        }
        setQuotations(quotations.map(quotation => quotation.id == id ? {...quotation,close:1} : quotation))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...form,
            order_details:refOrderDetails.current.getContent(),
            quotations
        }
        try {
            const resp = await apiAxios.put('order/' + form.id,data,{headers})
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                resp.data.data.forEach(error => {
                    sweetAlert({title : "Alerta", text: error, icon : "warning"});
                });
                return
            }
            sweetAlert({title : "Mensaje", text: resp.data.message, icon : "success"});
            handleSaveModalClose();
        } catch (error) {
            console.error(error);
            sweetAlert({title : "Mensaje", text: 'Error al actualizar el pedido', icon : "success"});
        }
    }
    const handleSaveModal = () => {
        const formOrder = document.querySelector("#form-order-submit");
        formOrder.click();
    }
  return (
    <Modal status={statusModal} title="Editar Pedido" onSave={handleSaveModal} handleCloseModal={handleCloseModal} maxWidth='max-w-3xl'>
        <form  className='grid grid-cols-12 gap-x-2 gap-y-0' onSubmit={handleSubmit}>
            <div className="col-span-full">
                <SeccionForm title="Datos del pedido"/>
            </div>
            <div className="col-span-full mb-2">
                <InputPrimary label="Cliente" type='text' inputRequired='required' disabled="disabled" value={form.order_customer||''}/>
                {
                    !form.order_igv && <small className='text-red-500 text-sm font-bold'>El pedido no incluye IGV</small>
                }
            </div>
            <div className="col-span-6">
                <InputPrimary label="Fecha de emisión" type='date' inputRequired='required' disabled="disabled" value={form.order_date_issue||''}/>
            </div>
            <div className="col-span-6">
                <SelectPrimary label="Tipo moneda" inputRequired='required' disabled="disabled" name="quotation_type_money" value={form.order_money||''}>
                    <option value="PEN">Soles (S/)</option>
                    <option value="USD">Dolares ($)</option>
                </SelectPrimary>
            </div>
            <div className="col-span-full">
                <SeccionForm title="Lista de cotizaciones"/>
            </div>
            <div className="col-span-full overflow-x-auto">
                <TableOrderEdit quotations={quotations} typeMoney={form.order_money} handleDelete={handleDelete}/>
            </div>
            <div className="col-span-full">
                <SeccionForm title="Datos adicionales"/>
            </div>
            <div className="col-span-full mb-2">
                <EditorText label="Descripción de productos" initialValue={form.order_details||''} id="quotation_details" editorRef={refOrderDetails}/>
            </div>
            <SubmitForm id="form-order-submit"/>
        </form>
    </Modal>
  )
}

export default FormOrder
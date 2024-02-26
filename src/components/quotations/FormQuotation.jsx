import React, { useEffect, useRef, useState } from 'react'
import Modal from '../Modal'
import SeccionForm from '../SeccionForm'
import { InputPrimary, SubmitForm } from '../Inputs'
import { SelectPrimary } from '../Selects';
import Select from 'react-select';
import TableQuotation from './TableQuotation';
import EditorText from '../EditorText';
import apiAxios from '@/axios';
import { getCookie } from '@/helpers/getCookie';
import { sweetAlert } from '@/helpers/getAlert';
const initalForm = {
    id:null,
    quotation_date_issue:"",
    quotation_type_money:"PEN",
    quotation_type_change:"",
    quotation_include_igv:true,
    quotation_customer:"",
    quotation_contact:"",
    quotation_address:"",
    quotation_actuality:null,
    quotation_discount:"0.00",
    quotation_description_products:"",
    quotation_conditions:"",
    quotation_observations:""
}
const initialAmountDetails = {
    quotation_amount:"0.00",
    quotation_igv:"0.00",
    quotation_total:"0.00"
}
function FormQuotation({statusModal,customers,quotationEdit,contactsList,productsList,productDetails,handleCloseModal,handleSaveModalForm,closeModalDesc,modalDesc,openModalDesc}) {
    const [form,setForm] = useState(initalForm);
    const [contacts,setContacts] = useState([]);
    const [idDetails,setIdDetails] = useState(null);
    const [products,setProducts] = useState([]);
    const editorDetails = useRef(null);
    const editorRefObservation = useRef(null);
    const editorRefCondition = useRef(null);
    const [amountDetails,setAmountDetails] = useState(initialAmountDetails);
    const headers = getCookie();
    const handleAddDescription = async (id) => {
        const existProduct = products.find(product => product.id == id);
        if(existProduct && existProduct.details === null){
            try {
                const resp = await apiAxios.get('quotation-extra/products-details/'+id,{headers})
                if(resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                editorDetails.current.setContent(resp.data.data||"");
                setIdDetails(id);
                openModalDesc();
            } catch (error) {
                console.error(error);
                sweetAlert({title : "Error", text: "Error al obtener la descripción del producto", icon : "error"});
            }
        }else{
            setIdDetails(existProduct.id);
            editorDetails.current.setContent(existProduct.details||"");
            openModalDesc();
        }
    }
    const handleSaveDescription = () => {
        setProducts(products.map(product => product.id == idDetails ? {...product,details:editorDetails.current.getContent()}:product));
        handleCloseDescription();
    }
    const handleCloseDescription = () => {
        setIdDetails(null);
        editorDetails.current.setContent("");
        closeModalDesc();
    }
    useEffect(()=>{
        let amount = 0;
        products.forEach(product => {
            amount += (parseFloat(product.price_aditional) + parseFloat(product.price_unit)) * product.quantity;
        });
        const discount = isNaN(form.quotation_discount) || !form.quotation_discount  ? 0 : parseFloat(form.quotation_discount)
        let subtotal = amount - discount;
        let igv = form.quotation_include_igv ? subtotal * 0.18 : 0;
        let total = subtotal + igv;
        setAmountDetails({
            ...amountDetails,
            quotation_amount:amount,
            quotation_igv:igv,
            quotation_total:total
        })
    },[products,form])
    useEffect(()=>{
        setContacts(contactsList.length ? contactsList : []);
    },[contactsList])
    useEffect(()=>{
        setProducts(productDetails.length ? productDetails : []);
    },[productDetails])
    useEffect(()=>{
        setForm(Object.keys(quotationEdit).length ? quotationEdit : initalForm);
    },[quotationEdit])
    const handleChangeForm = async (e) => {
        const key = e.target.name;
        const value = e.target.value; 
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
        if(key == 'quotation_customer' && value){
            try {
                const resq = await apiAxios.get('quotation/contacts/' + value,{headers});
                setContacts(resq.data.data.contacts);
                setForm(form => ({
                    ...form,
                    quotation_address:resq.data.data.address,
                    quotation_contact:resq.data.data.contacts.length === 1 ? resq.data.data.contacts[0].id : "",
                    quotation_include_igv:resq.data.data.disabledIgv
                }))
            } catch (error) {
                console.error(error)
                sweetAlert({title : "Error", text: "Error al obtener los contactos", icon : "error"});
            }
        }else if(key == 'quotation_customer' && !value){
            setContacts([]);
            setForm(form => ({
                ...form,
                quotation_address:""
            }))
        }
    }
    const handleProductSelect = (e) => {
        const existProduct = products.find(product => product.id == e.value)
        if(existProduct){
            existProduct.quantity++;
            setProducts(
                products.map(product => product.id == existProduct.id ? existProduct : product)
            )
        }else{
            setProducts([
                ...products,
                {
                    id: e.value,
                    description:e.label,
                    quantity:1,
                    price_unit: e.product_sale,
                    price_aditional: 0,
                    details:null
                }
            ])
        }
    }
    const handleDetailChange = (value,id,column) => {
        setProducts(products.map(product => product.id == id ? {...product,[column] : value} : product))
    }
    const handleDeleteDetail  = (id) => {
        setProducts(
            products.filter(product => product.id != id)
        )
    }
    const handleSaveModal = () => {
        const formCustomer = document.querySelector("#form-cotizacion-submit");
        formCustomer.click();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!products.length){
            return sweetAlert({title : "Alerta", text: "La cotización debe tener al menos un producto", icon : "warning"});
        }
        const data = {
            ...form,
            quotation_conditions:editorRefCondition.current.getContent(),
            quotation_observations:editorRefObservation.current.getContent(),
            products
        }
        try {
            const resp = await apiAxios.put('quotation/' + form.id,data,{headers})
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
            handleSaveModalForm();
        } catch (error) {
            console.error(error);
            sweetAlert({title : "Mensaje", text: 'Error al actualizar la cotización', icon : "success"});
        }
    }
  return (
    <>
    <Modal status={statusModal} title="Editar cotización" onSave={handleSaveModal} handleCloseModal={handleCloseModal} maxWidth='max-w-3xl'>
        <form  className='grid grid-cols-12 gap-x-2 gap-y-0' onSubmit={handleSubmit}>
            <div className="col-span-full">
                <SeccionForm title="Datos de la cotización"/>
            </div>
            <div className="col-span-full md:col-span-4">
                <InputPrimary label="Fecha de emisión" type='date' inputRequired='required' disabled="disabled" value={form.quotation_date_issue||''}/>
            </div>
            <div className="col-span-full md:col-span-4">
                <SelectPrimary label="Tipo moneda" inputRequired='required' name="quotation_type_money" value={form.quotation_type_money||''} onChange={handleChangeForm}>
                    <option value="PEN">Soles (S/)</option>
                    <option value="USD">Dolares ($)</option>
                </SelectPrimary>
            </div>
            <div className="col-span-full md:col-span-4">
                <InputPrimary label="Tipo cambio" inputRequired={form.quotation_type_money == 'USD' ? 'required' : ''} step="0.01" type='number' min="0" name="quotation_type_change" value={form.quotation_type_change||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full">
                <SeccionForm title="Datos del cliente"/>
            </div>
            <div className="col-span-full md:col-span-6">
                <SelectPrimary label="Cliente" inputRequired='required' name="quotation_customer" value={form.quotation_customer||''} onChange={handleChangeForm}>
                    <option value="">Seleccione un cliente</option>
                    {
                        customers.map(customer => <option key={customer.value} value={customer.value}>{customer.label}</option>)
                    }
                </SelectPrimary>
            </div>
            <div className="col-span-full md:col-span-6">
                <SelectPrimary label="Contacto" name="quotation_contact" inputRequired="required" value={form.quotation_contact||''} onChange={handleChangeForm}>
                    <option value="">Seleccione un contacto</option>
                    {
                        contacts.map(contact => <option key={contact.id} value={contact.id}>{contact.contact_name}</option>)
                    }
                </SelectPrimary>
            </div>
            <div className="col-span-full">
                <InputPrimary label="Dirección" type='text' name="quotation_address" value={form.quotation_address||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full">
                <SeccionForm title="Detalle de los productos"/>
            </div>
            <div className="col-span-full mb-2">
                <span className='text-sm mb-1 block dark:text-white text-placeholder'>Lista de productos</span>
                <Select instanceId='quotation_products_list' name='quotation_products_list' options={productsList} onChange={handleProductSelect} placeholder="Buscar" menuPosition='fixed'/>
                {
                    !form.quotation_include_igv ? <p className='text-sm text-red-600 my-2'>Esta cotización no incluye I.G.V debido a que el cliente <strong className='font-bold'>NO ES DE PERÚ</strong></p> : null
                }
            </div>
            <div className="col-span-full overflow-x-auto">
                <TableQuotation products={products} formatMoney={form.quotation_type_money} handleDetailChange={handleDetailChange} handleDeleteDetail={handleDeleteDetail} includeIgv={form.quotation_include_igv} dataTotal={{discount:form.quotation_discount,igv:amountDetails.quotation_igv,amount:amountDetails.quotation_amount,total:amountDetails.quotation_total}} handleChangeDiscount={handleChangeForm} handleDetails={handleAddDescription}/>
            </div>
            <div className="col-span-full">
                <SeccionForm title="Datos adicionales"/>
            </div>
            <div className="col-span-full mb-2">
                <EditorText label="Observaciones" initialValue={form.quotation_observations} id="quotation_observations" editorRef={editorRefObservation}/>
            </div>
            <div className="col-span-full mb-2">
                <EditorText label="Condiciones" initialValue={form.quotation_conditions} id="quotation_conditions" editorRef={editorRefCondition}/>
            </div>
            <SubmitForm id="form-cotizacion-submit"/>
        </form>
    </Modal>
    <Modal status={modalDesc} title="Agregar descripcion" maxWidth='w-[700px]' onSave={handleSaveDescription} handleCloseModal={handleCloseDescription}>
        <EditorText label="Descripción" id='details-producto-description' initialValue={form.quotation_actuality} editorRef={editorDetails}/>
      </Modal>
    </>
  )
}

export default FormQuotation
import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule';
import { ButtonPrimary } from '@/components/Buttons';
import EditorText from '@/components/EditorText';
import { InputPrimary } from '@/components/Inputs';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import SeccionForm from '@/components/SeccionForm';
import { SelectPrimary } from '@/components/Selects';
import TableQuotation from '@/components/quotations/TableQuotation';
import { getCookie } from '@/helpers/getCookie';
import { verifUser } from '@/helpers/verifUser';
import workSpace from '@/img/quotation.png';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select';
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    return await verifUser(userCookie,'/quotation/new');
}
const initalForm = {
    quotation_date_issue:new Date().toISOString().split('T')[0],
    quotation_type_money:"PEN",
    quotation_type_change:"",
    quotation_include_igv:true,
    quotation_customer:"",
    quotation_contact:"",
    quotation_address:"",
    quotation_discount:"0.00"
}
const initialAmountDetails = {
    quotation_amount:"0.00",
    quotation_igv:"0.00",
    quotation_total:"0.00"
}
function quotationNew({nameUser,dataModules,dataRoles}) {
    const [form,setForm] = useState(initalForm);
    const [products,setProducts] = useState([]);
    const [productsList,setProductsList] = useState([]);
    const [amountDetails,setAmountDetails] = useState(initialAmountDetails);
    const [contacts,setContacts] = useState([]);
    const [customers,setCustomers] = useState([]);
    const editorRefObservation = useRef(null);
    const editorRefCondition = useRef(null);
    const route = useRouter();
    const editorRefDescriptionProducts = useRef(null);
    const headers = getCookie();
    useEffect(()=>{
        const getData = async () => {
            try {
                const all = await axios.all([
                    apiAxios.get('/quotation-extra/customers',{headers}),
                    apiAxios.get('/quotation-extra/products',{headers})
                ]);
                setCustomers(all[0].data.data);
                setProductsList(all[1].data.data);
            } catch (error) {
                // console.log(error);
                alert('Error al obtener los clientes y productos')
                // dispatch({type:TYPES_USER.NO_USERS});
            }
        }
        getData();
    },[])
    useEffect(()=>{
        let amount = 0;
        products.forEach(product => {
            amount += (parseFloat(product.price_aditional) + parseFloat(product.price_unit)) * product.quantity;
        });
        let subtotal = amount - form.quotation_discount;
        let igv = form.quotation_include_igv ? subtotal * 0.18 : 0;
        let total = subtotal + igv;
        setAmountDetails({
            ...amountDetails,
            quotation_amount:amount,
            quotation_igv:igv,
            quotation_total:total
        })
    },[products,form])
    const handleDeleteDetail  = (id) => {
        setProducts(
            products.filter(product => product.id != id)
        )
    }
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
                alert('Error al obtener los contactos');
            }
        }else if(key == 'quotation_customer' && !value){
            setContacts([]);
            setForm(form => ({
                ...form,
                quotation_address:""
            }))
        }
    }
    const handleDetailChange = (value,id,column) => {
        setProducts(products.map(product => product.id == id ? {...product,[column] : value} : product))
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
                }
            ])
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!products.length){
            return alert('La cotización debe tener al menos un producto');
        }
        if(!window.confirm('¿Deseas generar una nueva cotización?')){
            return
        }
        const data = {
            ...form,
            quotation_description_products:editorRefDescriptionProducts.current.getContent(),
            quotation_conditions:editorRefCondition.current.getContent(),
            quotation_observations:editorRefObservation.current.getContent(),
            products
        }
        try {
            const resp = await apiAxios.post('quotation',data,{headers})
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            if(resp.data.error){
                resp.data.data.forEach(error => {
                    alert(error);
                });
                return
            }
            alert(resp.data.message);
            setForm(initalForm);
            setContacts([]);
            setProducts([]);
            editorRefDescriptionProducts.current.setContent("");
            editorRefCondition.current.setContent("");
            editorRefObservation.current.setContent("");
        } catch (error) {
            console.log(error);
            alert('Error al generar una nueva cotización');
        }
    }
  return (
    <LoyoutIntranet title="Nueva cotización" description="Creación de nuevas cotizaciones" names={nameUser} modules={dataModules} roles={dataRoles}>
        <BanerModule imageBanner={workSpace} title="Nueva cotización"/>
        <form id='form-quotation' onSubmit={handleSubmit}>
            <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                <div className="col-span-full">
                    <SeccionForm title="Datos de la cotización"/>
                </div>
                <div className="col-span-4">
                    <InputPrimary label="Fecha de emisión" type='date' inputRequired='required' disabled="disabled" value={form.quotation_date_issue||''}/>
                </div>
                <div className="col-span-4">
                    <SelectPrimary label="Tipo moneda" inputRequired='required' name="quotation_type_money" value={form.quotation_type_money||''} onChange={handleChangeForm}>
                        <option value="PEN">Soles (S/)</option>
                        <option value="USD">Dolares ($)</option>
                    </SelectPrimary>
                </div>
                <div className="col-span-4">
                    <InputPrimary label="Tipo cambio" type='number' step="0.01" min="0" name="quotation_type_change" value={form.quotation_type_change||''} onChange={handleChangeForm}/>
                </div>
            </div>
            <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                <div className="col-span-full">
                    <SeccionForm title="Datos del cliente"/>
                </div>
                <div className="col-span-6">
                    <SelectPrimary label="Cliente" inputRequired='required' name="quotation_customer" value={form.quotation_customer||''} onChange={handleChangeForm}>
                        <option value="">Seleccione un cliente</option>

                        {
                            customers.map(customer => <option key={customer.value} value={customer.value}>{customer.label}</option>)
                        }
                    </SelectPrimary>
                </div>
                <div className="col-span-6">
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
            </div>
            <div className='w-full p-6 mb-4 bg-white rounded-md shadow overflow-x-auto grid grid-cols-12 gap-x-3 gap-y-0'>
                <div className="col-span-full">
                    <SeccionForm title="Detalle de los productos"/>
                </div>
                <div className="col-span-full mb-2">
                    <span className='text-sm mb-1 block dark:text-white text-placeholder'>Lista de productos</span>
                    <Select instanceId='quotation_products_list' name='quotation_products_list' options={productsList} onChange={handleProductSelect} placeholder="Buscar" menuPosition='fixed'/>
                    {
                        !form.quotation_include_igv && <p className='text-sm text-red-600 my-2'>Esta cotización no incluye I.G.V debido a que el cliente <strong className='font-bold'>NO ES DE PERÚ</strong></p>
                    }
                </div>
                <div className="col-span-full">
                    <TableQuotation products={products} formatMoney={form.quotation_type_money} handleDetailChange={handleDetailChange} handleDeleteDetail={handleDeleteDetail} includeIgv={form.quotation_include_igv} dataTotal={{discount:form.quotation_discount,igv:amountDetails.quotation_igv,amount:amountDetails.quotation_amount,total:amountDetails.quotation_total}} handleChangeDiscount={handleChangeForm}/>
                </div>
            </div>
            <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                <div className="col-span-full">
                    <SeccionForm title="Datos adicionales"/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Descripción de productos" id="quotation_details_products" editorRef={editorRefDescriptionProducts}/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Observaciones" id="quotation_observations" editorRef={editorRefObservation}/>
                </div>
                <div className="col-span-full mb-2">
                    <EditorText label="Condiciones" id="quotation_conditions" editorRef={editorRefCondition}/>
                </div>
                <div className="col-span-full text-center">
                    <ButtonPrimary text="Generar" type='submit' icon={<PaperAirplaneIcon className='w-5 h-5'/>}/>
                </div>
            </div>
        </form>
        
    </LoyoutIntranet>
  )
}

export default quotationNew
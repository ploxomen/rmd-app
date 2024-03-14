import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule';
import { ButtonDanger, ButtonPrimary } from '@/components/Buttons';
import EditorText from '@/components/EditorText';
import { InputPrimary } from '@/components/Inputs';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import Modal from '@/components/Modal';
import SeccionForm from '@/components/SeccionForm';
import { SelectPrimary } from '@/components/Selects';
import TableQuotation from '@/components/quotations/TableQuotation';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import { verifUser } from '@/helpers/verifUser';
import { useModal } from '@/hooks/useModal';
import { EyeIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
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
    quotation_actuality:null,
    quotation_contact:"",
    quotation_address:"",
    quotation_discount:"0.00",
    quotation_observations:"",
    quotation_project:"",
    quotation_conditions:""
}
const initialAmountDetails = {
    quotation_amount:"0.00",
    quotation_igv:"0.00",
    quotation_total:"0.00"
}
function quotationNew({dataUser,dataModules,dataRoles}) {
    const [form,setForm] = useState(initalForm);
    const [products,setProducts] = useState([]);
    const [productsList,setProductsList] = useState([]);
    const [idDetails,setIdDetails] = useState(null);
    const [amountDetails,setAmountDetails] = useState(initialAmountDetails);
    const [contacts,setContacts] = useState([]);
    const [customers,setCustomers] = useState([]);
    const editorRefObservation = useRef(null);
    const editorRefCondition = useRef(null);
    const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");
    const editorDetails = useRef(null);
    const [editorDetail,setEditorDetail] = useState({
        quotation_observations:"",
        quotation_conditions:""
    });
    const route = useRouter();
    const headers = getCookie();
    useEffect(()=>{
        const getData = async () => {
            try {
                const all = await axios.all([
                    apiAxios.get('/quotation-extra/customers',{headers}),
                    apiAxios.get('/quotation-extra/products',{headers}),
                    apiAxios.get('/quotation-extra/config',{headers})
                ]);
                setCustomers(all[0].data.data);
                setProductsList(all[1].data.data);
                const dataReplace = {};
                all[2].data.data.forEach(config => {
                    dataReplace[config.description] = config.value;
                });
                setEditorDetail(dataReplace);
                setForm({
                    ...form,
                    ...dataReplace
                })
            } catch (error) {
                console.error(error);
                sweetAlert({title : "Error", text:'Error al obtener los datos', icon : "error"});
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
    const handleContact = async (e) => {
        try {
            const resq = await apiAxios.get('quotation/contacts/' + e.value,{headers});
            setContacts(resq.data.data.contacts);
            setForm(form => ({
                ...form,
                quotation_customer:e.value,
                quotation_address:resq.data.data.address,
                quotation_contact:resq.data.data.contacts.length === 1 ? resq.data.data.contacts[0].id : "",
                quotation_include_igv:resq.data.data.disabledIgv
            }))
        } catch (error) {
            sweetAlert({title : "Error", text:'Error al obtener los contactos', icon : "error"});
        }
    }
    const handleChangeForm = async (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
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
                    is_service:!e.product_service ? 0 : e.product_service,
                    quantity:1,
                    price_unit: e.product_sale,
                    price_aditional: 0,
                    details:null
                }
            ])
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!form.quotation_address){
            return await sweetAlert({title : "Alerta", text:'Se debe establecer una dirección', icon : "warning"});
        }
        if(!products.length){
            return await sweetAlert({title : "Alerta", text:'La cotización debe tener al menos un producto', icon : "warning"});
        }
        let existServiceEmpty = false;
        products.forEach(product => {
            if((product.is_service === 1 && !product.price_aditional) || (product.is_service === 1 && product.price_aditional < 0)){
                existServiceEmpty = true;
                return sweetAlert({title : "Alerta", text:`El valor del precio adicional del servicio ${product.description} debe ser mayor a cero`, icon : "warning"}); 
            }
        })
        if(existServiceEmpty){
            return
        }
        const question = await sweetAlert({title : "Mensaje", text: "¿Deseas generar una nueva cotización?", icon : "question",showCancelButton:true});
        if(!question.isConfirmed){
            return
        }
        const data = {
            ...form,
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
                    sweetAlert({title : "Alerta", text: error, icon : "warning"});
                });
                return
            }
            sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
            setForm({...initalForm,...editorDetail});
            setContacts([]);
            setProducts([]);
            editorRefCondition.current.setContent(editorDetail.quotation_conditions);
            editorRefObservation.current.setContent(editorDetail.quotation_observations);
            window.open(`/intranet/quotation/view/${resp.data.id}?fileName=${resp.data.fileName}` ,'_blank');
        } catch (error) {
            console.error(error);
            sweetAlert({title : "Error", text: "Error al generar una nueva cotización, intentelo más tarde", icon : "error"});
        }
    }
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
                handleOpenModal();
            } catch (error) {
                console.error(error);
                sweetAlert({title : "Error", text: "Error al obtener la descripción del producto", icon : "error"});
            }
        }else{
            setIdDetails(existProduct.id);
            editorDetails.current.setContent(existProduct.details||"");
            handleOpenModal();
        }
    }
    const handleSaveDescription = () => {
        setProducts(products.map(product => product.id == idDetails ? {...product,details:editorDetails.current.getContent()}:product));
        handleCloseDescription();
    }
    const handleCloseDescription = () => {
        setIdDetails(null);
        editorDetails.current.setContent("");
        handleCloseModal();
    }
    const handlePreview = async () => {
        const resp = await apiAxios.post('quotation-extra/preview',{
            ...form,
            quotation_conditions:editorRefCondition.current.getContent(),
            quotation_observations:editorRefObservation.current.getContent(),
            products
        },{
            responseType:'blob',
            headers
        })
        var blobURL = URL.createObjectURL(resp.data);
        let iframe = document.querySelector("#preview") || document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.id = "preview";
        iframe.style.display = 'none';
        iframe.src = blobURL;
        iframe.onload = function() {
            setTimeout(function() {
                iframe.focus();
                iframe.contentWindow.print();
            }, 1);
        };
    }
  return (
    <>
        <LoyoutIntranet title="Nueva cotización" description="Creación de nuevas cotizaciones" user={dataUser} modules={dataModules} roles={dataRoles}>
            <BanerModule imageBanner='/baners/Group 18.jpg' title="Nueva cotización"/>
            <form id='form-quotation' onSubmit={handleSubmit}>
                <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
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
                        <InputPrimary label="Tipo cambio" type='number' inputRequired={form.quotation_type_money == 'USD' ? 'required' : ''} step="0.01" min="0" name="quotation_type_change" value={form.quotation_type_change||''} onChange={handleChangeForm}/>
                    </div>
                </div>
                <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                    <div className="col-span-full">
                        <SeccionForm title="Datos del cliente"/>
                    </div>
                    <div className="col-span-full md:col-span-6 text-placeholder">
                        <label htmlFor="quotation_customer" className="text-sm mb-1 block dark:text-white">Cliente <span className="text-red-500 font-bold pl-1">*</span> </label>
                        <Select instanceId='quotation_customer' placeholder="Seleccione un cliente" name='quotation_customer' options={customers} onChange={handleContact} menuPosition='fixed'/>
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
                        <InputPrimary label="Proyecto" type='text' inputRequired='required' name="quotation_project" value={form.quotation_project||''} onChange={handleChangeForm}/>
                    </div>
                </div>
                <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                    <div className="col-span-full">
                        <SeccionForm title="Detalle de los productos"/>
                    </div>
                    <div className="col-span-full mb-2">
                        <span className='text-sm mb-1 block dark:text-white text-placeholder'>{
                            !form.quotation_include_igv && <p className='text-sm text-red-600 my-2'>Esta cotización no incluye I.G.V debido a que el cliente <strong className='font-bold'>NO ES DE PERÚ</strong></p>
                        }Lista de productos</span>
                        <Select instanceId='quotation_products_list' className='text-placeholder' name='quotation_products_list' options={productsList} onChange={handleProductSelect} placeholder="Buscar" menuPosition='fixed'/>
                        
                    </div>
                    <div className="col-span-full overflow-x-auto">
                        <TableQuotation products={products} formatMoney={form.quotation_type_money} handleDetailChange={handleDetailChange} handleDeleteDetail={handleDeleteDetail} includeIgv={form.quotation_include_igv} dataTotal={{discount:form.quotation_discount,igv:amountDetails.quotation_igv,amount:amountDetails.quotation_amount,total:amountDetails.quotation_total}} handleChangeDiscount={handleChangeForm} handleDetails={handleAddDescription}/>
                    </div>
                </div>
                <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                    <div className="col-span-full">
                        <SeccionForm title="Datos adicionales"/>
                    </div>
                    <div className="col-span-full mb-2">
                        <EditorText label="Observaciones" initialValue={form.quotation_observations} id="quotation_observations" editorRef={editorRefObservation}/>
                    </div>
                    <div className="col-span-full mb-2">
                        <EditorText label="Condiciones" initialValue={form.quotation_conditions} id="quotation_conditions" editorRef={editorRefCondition}/>
                    </div>
                    <div className="col-span-full text-center">
                        <ButtonPrimary text="Generar" type='submit' icon={<PaperAirplaneIcon className='w-5 h-5'/>}/>
                        <ButtonDanger text="Vista previa" icon={<EyeIcon className='w-5 h-5'/>} onClick={handlePreview}/>
                    </div>
                </div>
            </form>
        </LoyoutIntranet>
        <Modal status={modal} title="Agregar descripcion" maxWidth='w-[700px]' onSave={handleSaveDescription} handleCloseModal={handleCloseDescription}>
            <EditorText label="Descripción" id='details-producto-description' initialValue={form.quotation_actuality} editorRef={editorDetails}/>
        </Modal>
    </>
  )
}

export default quotationNew
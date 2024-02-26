import '@/app/globals.css';
import apiAxios from '@/axios';
import BanerModule from '@/components/BanerModule';
import { ButtonPrimary } from '@/components/Buttons';
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
    quotation_actuality:null,
    quotation_contact:"",
    quotation_address:"",
    quotation_discount:"0.00",
    quotation_observations:`<p><span style="font-size: 10pt;"><strong>OBSERVACIONES:</strong> NO INCLUYE INSTALACI&Oacute;N Y TRANSPORTE</span></p>
    <p><strong><span style="font-size: 10pt;">Plazo de Fabricaci&oacute;n:</span></strong></p>
    <p><strong><span style="font-size: 10pt;">Plazo de Entrega:&nbsp;</span></strong></p>`,
    quotation_conditions:`<ul>
    <li style="font-size: 10pt;"><span style="font-size: 10pt;"><strong>Superficies para la instalaci&oacute;n:</strong> La superficie destinada a la instalaci&oacute;n deber&aacute; presentar una base de CONCRETO s&oacute;lida, nivelada, limpia, seca y libre de obstrucciones.</span></li>
    <li style="font-size: 10pt;"><span style="font-size: 10pt;"><strong>Seguro del personal de obra:</strong> El servicio de instalaci&oacute;n incluye seguro del personal de RMD (SCTR Y EPIS), proporcionado por la empresa durante la ejecuci&oacute;n de los trabajos contratados.</span></li>
    <li style="font-size: 10pt;"><span style="font-size: 10pt;"><strong>Suministro de fluido el&eacute;ctrico y almacenamiento:</strong> El cliente deber&aacute; suministrar el fluido el&eacute;ctrico requerido, as&iacute; como almac&eacute;n seguro para guardar materiales y maquinas, permisos municipales o cuota sindical.</span></li>
    <li style="font-size: 10pt;"><span style="font-size: 10pt;"><strong>Entrega de productos o insumos: </strong>A menos que se acuerde lo contrario, los productos y/o insumos ser&aacute;n entregados una vez que se haya reflejado la cancelaci&oacute;n correspondiente en la cuenta bancaria. El cliente deber&aacute; efectuar el pago seg&uacute;n los t&eacute;rminos acordados para garantizar la entrega oportuna de los productos y/o insumos. El horario establecido para la recogida de los productos ser&aacute; de lunes a viernes de 9:00 h a 17:00 h.</span></li>
    </ul>
    <p><span style="font-size: 10pt;"><strong><span style="line-height: 107%; font-family: Calibri, sans-serif;">GARANTIA:</span></strong><span style="line-height: 107%; font-family: Calibri, sans-serif;"> Defecto de f&aacute;brica, reemplazo inmediato.</span></span></p>
    <p><span style="font-size: 10pt;"><span style="line-height: 107%; font-family: Calibri, sans-serif;"><strong>NO INCLUYE:</strong> Otro tipo de documentaci&oacute;n (pdr, examenes m&eacute;dicos y/o requisitos adicionales, ni costes para charlas de inducci&oacute;n, etc)</span></span></p>
    <p><span style="font-size: 10pt;"><span style="line-height: 107%; font-family: Calibri, sans-serif;"><strong>LUGAR DE ENTREGA:</strong> ALMACEN RMD / No incluye prueba covid</span></span></p>
    <p><span style="font-size: 10pt;"><span style="line-height: 107%; font-family: Calibri, sans-serif;"><strong>FORMA DE PAGO:</strong> </span></span></p>
    <p><span style="font-size: 10pt;"><span style="line-height: 107%; font-family: Calibri, sans-serif;"><strong>TIEMPO DE VALIDEZ DE COTIZACI&Oacute;N:</strong> 15 D&Iacute;AS HABILES</span></span></p>`
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
    const route = useRouter();
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
                console.error(error);
                sweetAlert({title : "Error", text:'Error al obtener los clientes y productos', icon : "error"});
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
                sweetAlert({title : "Error", text:'Error al obtener los contactos', icon : "error"});
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
                    details:null
                }
            ])
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!products.length){
            return await sweetAlert({title : "Alerta", text:'La cotización debe tener al menos un producto', icon : "warning"});
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
            setForm(initalForm);
            setContacts([]);
            setProducts([]);
            editorRefCondition.current.setContent("");
            editorRefObservation.current.setContent("");
            window.open('/intranet/quotation/view/'+resp.data.id,'_blank');
        } catch (error) {
            console.error(error);
            sweetAlert({title : "Error", text: "Error al generar una nueva cotización", icon : "error"});
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
                </div>
                <div className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0'>
                    <div className="col-span-full">
                        <SeccionForm title="Detalle de los productos"/>
                    </div>
                    <div className="col-span-full mb-2">
                        <span className='text-sm mb-1 block dark:text-white text-placeholder'>{
                            !form.quotation_include_igv && <p className='text-sm text-red-600 my-2'>Esta cotización no incluye I.G.V debido a que el cliente <strong className='font-bold'>NO ES DE PERÚ</strong></p>
                        }Lista de productos</span>
                        <Select instanceId='quotation_products_list' name='quotation_products_list' options={productsList} onChange={handleProductSelect} placeholder="Buscar" menuPosition='fixed'/>
                        
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
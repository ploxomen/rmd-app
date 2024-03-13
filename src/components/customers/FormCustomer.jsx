import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import SeccionForm from '../SeccionForm';
import { SelectPrimary } from '../Selects';
import { InputPrimary, SubmitForm } from '../Inputs';
import apiAxios from '@/axios';
import { getCookie } from '@/helpers/getCookie';
import { ButtonDanger,  ButtonSecondarySm } from '../Buttons';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { sweetAlert } from '@/helpers/getAlert';
const dataForm = {
    id:null,
    customer_type_document: "",
    customer_number_document:"",
    customer_name:"",
    customer_email:"",
    customer_phone:"",
    customer_cell_phone:"",
    customer_departament:"",
    customer_province:"",
    customer_district:"",
    customer_contrie:173,
    customer_address:"",
}
function FormCustomer({statusModal,contries,customerEdit,contactsEdit,pronvincesData,districtsData,typeDocumentsData,departamentsData,handleSaveCustomer,closeModal}) {
    const [form,setForm] = useState(dataForm);
    const [provinces,setProvinces] = useState([]);
    const [districts,setDistricts] = useState([]);
    const [contacts,setContacts] = useState([]);
    const edit = Object.keys(customerEdit).length;
    const filterLengthDocuments = typeDocumentsData.find(typeDocument => typeDocument.id == form.customer_type_document)
    const digitDocuments = {min:filterLengthDocuments && filterLengthDocuments.id == 5 ? 1 : (filterLengthDocuments && filterLengthDocuments.document_length),max: filterLengthDocuments && filterLengthDocuments.document_length};
    const headers = getCookie();
    useEffect(()=>{
        setForm(edit ? customerEdit : dataForm);
    },[customerEdit]);
    const handleChangeForm = async (e) => {
        const key = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [key] : value
        })
        if(key == 'customer_contrie'){
            setForm(form => {
                return {...form,customer_type_document:value != dataForm.customer_contrie ? 5 : 1,customer_district:null}
            });
        }else if(value == '' && key == 'customer_departament'){
            setProvinces([]);
            setDistricts([]);
            setForm(form => {
                return {
                    ...form,
                    customer_district:"",
                    customer_province:""
                }
            });
        }else if(value == '' && key == 'customer_province'){
            setDistricts([]);
            setForm(form => {
                return {
                    ...form,
                    customer_district:""
                }
            });
        }
        if(['customer_departament','customer_province'].indexOf(key) >= 0 && value != ''){
            try {
                const resp = await apiAxios.get(key == 'customer_departament' ? `/provinces/${value}` : `/districts/${value}`,{headers});
                if(key == 'customer_departament'){
                    setProvinces(resp.data.data);
                }else{
                    setDistricts(resp.data.data);
                }
            } catch (error) {
                console.error(error);
                sweetAlert({title : "Error", text: "Error al obtener el ubigeo", icon : "error"});            ;
            }
        }
    }
    useEffect(()=>{
        setContacts(contactsEdit ? contactsEdit : []);
    },[contactsEdit]);
    useEffect(()=>{
        setProvinces(pronvincesData ? pronvincesData : []);
    },[pronvincesData]);
    useEffect(()=>{
        setDistricts(districtsData ? districtsData : []);
    },[districtsData]);
    const handleAddContact = () => {
        setContacts([
            ...contacts,
            {id:(new Date).getTime(),contact_name:"",contact_number:"",type:"new",contact_position:"",contact_email:""}
        ])
    }
    const handleChangeContact = (id,column,value) => {
        let cloneContact = contacts.slice();
        cloneContact = cloneContact.map(contact => contact.id == id ? {...contact,[column] : value} : contact)
        setContacts(cloneContact);
    }
    const handleDeleteContact = async (id) => {
        const contact = contacts.find(cont => cont.id == id);
        if(!window.confirm("¿Deseas eliminar este contacto?")){
            return
        }
        if(contact.type === 'old'){
            try {   
                const resp = await apiAxios.delete('/customer-contact/' + id,{headers});
                sweetAlert({title : "Mensaje", text: resp.data.message, icon : resp.data.error ? "error" : "success"});            ;
            } catch (error) {
                console.error(error);
                sweetAlert({title : "Error", text: "Ocurrió un error al eliminar el contacto", icon : "error"});            ;
            }
        }
        setContacts(contacts.filter(contact => contact.id != id));
    }
    const hanbleSendModal = () => {
        const formCustomer = document.querySelector("#form-customer-submit");
        formCustomer.click();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let continueProcess = true;
        contacts.forEach(contact => {
            if(!contact.contact_email && !contact.contact_number){
                continueProcess = false;
                sweetAlert({title : "Alerta", text: 'El contacto ' + contact.contact_name + ' debe de tener número o correo', icon : "warning"});
            }
        });
        if(continueProcess){
            handleSaveCustomer(form,contacts);
        }
    }
  return (
    <Modal status={statusModal} title={edit ? 'Editar cliente' : 'Nuevo cliente'} onSave={hanbleSendModal} handleCloseModal={closeModal}>
        <form  className='grid grid-cols-12 gap-x-3 gap-y-0' onSubmit={handleSubmit}>
            <div className="col-span-full">
                <SeccionForm title="Datos personales"/>
            </div>
            <div className="col-span-6">
                <SelectPrimary label="Paises" inputRequired='required' name="customer_contrie" value={form.customer_contrie||''} onChange={handleChangeForm}>
                    <option value="">Seleccione una opción</option>
                    {
                        contries.map(contrie => <option value={contrie.id} key={contrie.id}>{contrie.contrie}</option>)
                    }
                </SelectPrimary>
            </div>
            <div className="col-span-6">
                <SelectPrimary label="Tipo documento" inputRequired='required' name="customer_type_document" value={form.customer_type_document||''} onChange={handleChangeForm} disabled={form.customer_contrie != dataForm.customer_contrie}>
                    <option value="">Seleccione una opción</option>
                    {
                        typeDocumentsData.map(document => form.customer_contrie == dataForm.customer_contrie && document.id == 5 ? null : <option value={document.id} key={document.id}>{document.document_name}</option>)
                    }
                </SelectPrimary>
            </div>
            <div className="col-span-full">
                <InputPrimary label="N° Documento" minLength={digitDocuments.min} maxLength={digitDocuments.max} inputRequired='required' name="customer_number_document" value={form.customer_number_document||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-12">
                <InputPrimary label="Razón social / Nombres completos" inputRequired='required' name="customer_name" value={form.customer_name} onChange={handleChangeForm}/>
            </div>
            {
                form.customer_contrie == dataForm.customer_contrie &&
                <>
                <div className="col-span-full">
                    <SelectPrimary label="Departamento" name="customer_departament" value={form.customer_departament} inputRequired={'required'} onChange={handleChangeForm}>
                        <option value="">Ninguno</option>
                        {
                            departamentsData.map(departament => <option value={departament.id} key={departament.id}>{departament.departament_name}</option>)
                        }
                    </SelectPrimary>
                </div>
                <div className="col-span-full">
                    <SelectPrimary label="Provincia" name="customer_province" inputRequired={'required'} value={form.customer_province||''} onChange={handleChangeForm}>
                        <option value="">Ninguno</option>
                        {
                            provinces.map(province => <option value={province.id} key={province.id}>{province.province_name||''}</option>)
                        }
                    </SelectPrimary>
                </div>
                <div className="col-span-full">
                    <SelectPrimary label="Distrito" inputRequired={'required'} name="customer_district" value={form.customer_district||''} onChange={handleChangeForm}>
                        <option value="">Ninguno</option>
                        {
                            districts.map(district => <option value={district.id} key={district.id}>{district.district_name}</option>)
                        }
                    </SelectPrimary>
                </div>
                </>
            }
            <div className="col-span-full mb-2">
                <InputPrimary label="Dirección" inputRequired='required' name="customer_address" value={form.customer_address} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full flex justify-between items-center gap-2 mb-4">
                <SeccionForm title="Contactos"/>
                <ButtonSecondarySm icon={<PlusCircleIcon className='w-5 h-5'/>} text="Agregar" onClick={handleAddContact}/>
            </div>
            <div className="col-span-full">
                {
                    !contacts.length ? <span className='text-red-500'>No se asignaron contactos</span>
                    : 
                    contacts.map(contact => (
                    <div className='grid grid-cols-6 gap-x-2 items-center' key={contact.id}>
                        <div className='col-span-3'>
                            <InputPrimary label="Cargo" value={contact.contact_position||''} name={`position${contact.id}`} onChange={e => handleChangeContact(contact.id,'contact_position',e.target.value)}/>
                        </div>
                        <div className='col-span-3'>
                            <InputPrimary label="Nombres" value={contact.contact_name||''} inputRequired='required' name={`name${contact.id}`} onChange={e => handleChangeContact(contact.id,'contact_name',e.target.value)}/>
                        </div>
                        <div className='col-span-3'>
                            <InputPrimary label="Correo" type='email' value={contact.contact_email||''} name={`email${contact.id}`} onChange={e => handleChangeContact(contact.id,'contact_email',e.target.value)}/>
                        </div>
                        <div className='col-span-2'>
                            <InputPrimary label="Celular" type='tel' value={contact.contact_number||''} name={`number${contact.id}`} onChange={e => handleChangeContact(contact.id,'contact_number',e.target.value)}/>
                        </div>
                        <div className='col-span-1'>
                            <ButtonDanger icon={<TrashIcon className='w-4 h-4'/>} onClick={e => handleDeleteContact(contact.id)}/>
                        </div>
                    </div>
                    ))
                }
            </div>
            <SubmitForm id="form-customer-submit"/>
        </form>
    </Modal>
  )
}

export default FormCustomer
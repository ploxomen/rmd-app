import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import { InputPrimary, SubmitForm } from '../Inputs'
import { SelectPrimary } from '../Selects'
import SeccionForm from '../SeccionForm'
import { XMarkIcon } from '@heroicons/react/24/solid'

const dataForm = {
    id:null,
    user_type_document: "",
    user_number_document:"",
    user_name:"de",
    user_last_name:"de",
    user_cell_phone:"",
    user_phone:"",
    user_birthdate:"",
    user_gender:"",
    user_address:"",
    user_email:"de",
    user_password:"sistema123",
}
function FormUser({rolesData,typeDocumentsData,saveUser,dataUser,dataUserRol,statusModal,closeModal}) {
    
    const [form,setForm] = useState(dataForm);
    const [roles,setRoles] = useState([]);
    const filterLengthDocuments = typeDocumentsData.find(typeDocument => typeDocument.id == form.user_type_document)
    const digitDocuments = {min:filterLengthDocuments && filterLengthDocuments.id == 5 ? 1 : (filterLengthDocuments && filterLengthDocuments.document_length),max: filterLengthDocuments && filterLengthDocuments.document_length};
    useEffect(()=>{
        setRoles(dataUserRol ? dataUserRol : [])
    },[dataUserRol])
    useEffect(()=>{
        setForm(Object.keys(dataUser).length ? dataUser : dataForm);
    },[dataUser])
    const handleChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }
    const handleSave = (e) => {
        e.preventDefault();
        if(!roles.length){
            return alert("Debe seleccionar al menos un rol");
        }
        saveUser(form,roles.map(role => role.id));
    }
    const handleDeleteRole = (idRole) => {
        setRoles(roles.filter(role => role.id != idRole))
    }
    const handleSelectRole = (e) => {
        const roleSelect = rolesData.find(role => role.id == e.target.value);
        if(!roleSelect){
            return alert('No se encontró el rol que seleccionó');
        }
        if(!roles.filter(role => role.id == roleSelect.id).length){
            setRoles(
                [...roles,roleSelect]
            )
        }
    }
    const handleSaveModal = () => {
        const formUser = document.querySelector("#form-user-submit");
        formUser.click();
    }
  return (
    <Modal title="Nuevo usuario" status={statusModal} onSave={handleSaveModal} handleCloseModal={closeModal}>
        <form className='grid grid-cols-6 gap-x-3 gap-y-0' onSubmit={handleSave}>
            <div className="col-span-full">
                <SeccionForm title="Datos personales"/>
            </div>
            <div className="col-span-3">
                <SelectPrimary label="Tipo documento" name="user_type_document" value={form.user_type_document||''} onChange={handleChangeForm}>
                    <option value="">Ninguno</option>
                    {
                        typeDocumentsData.map(document => <option value={document.id} key={document.id}>{document.document_name}</option>)
                    }
                </SelectPrimary>
            </div>
            <div className="col-span-3">
                <InputPrimary label="N° Documento" name="user_number_document" minLength={digitDocuments.min} maxLength={digitDocuments.max} inputRequired={digitDocuments.min && 'required'} value={form.user_number_document||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-3">
                <InputPrimary label="Nombres" name="user_name" inputRequired='required' value={form.user_name} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-3">
                <InputPrimary label="Apellidos" name="user_last_name" inputRequired='required' value={form.user_last_name} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-2">
                <InputPrimary label="Celular" type='tel' inputRequired='required' name="user_cell_phone" value={form.user_cell_phone||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-2">
                <InputPrimary label="Fecha nacimiento" name="user_birthdate" type='date' value={form.user_birthdate||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-2">
                <SelectPrimary label="Género" name="user_gender" value={!form.user_gender ? 'N' : form.user_gender} onChange={handleChangeForm}>
                    <option value="N">No establecer</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                </SelectPrimary>            
            </div>
            <div className="col-span-full">
                <SeccionForm title="Datos del sistema"/>
            </div>
            <div className="col-span-full">
                <InputPrimary label="Correo" type='email' name="user_email" inputRequired='required' value={form.user_email} onChange={handleChangeForm}/>
            </div>
            {
                form.hasOwnProperty('user_password') && <div className="col-span-3"><InputPrimary label="Contraseña" name="user_password" inputRequired='required' value={form.user_password} onChange={handleChangeForm}/></div>

            }
            <div className="col-span-3">
            <SelectPrimary label="Roles" name="user_role" value="" onChange={handleSelectRole}>
                <option value="" disabled hidden>Seleccione una opción</option>
                {
                    rolesData.map((role,index) => index > 0 && <option value={role.id} key={role.id}>{role.rol_name}</option>)
                }
            </SelectPrimary>
            </div>
            <div className="col-span-full">
                <SeccionForm title="Roles seleccionados"/>
            {
                !roles.length ? <span className='text-red-600'>No se seleccionaron roles</span> : 
                <div className='flex gap-2 flex-wrap'> {roles.map(role => (
                    <div className='p-1 text-sm rounded-md bg-violet-400 flex items-center gap-1' key={role.id}>
                        <span className='font-medium text-white'>{role.rol_name}</span>
                        <button className='text-white' onClick={e => handleDeleteRole(role.id)}>
                            <XMarkIcon className='w-4 h-4 font-bold'/>
                        </button>
                    </div>
                ))}
                </div>
            }
            </div>
            <SubmitForm id="form-user-submit"/>
        </form>
    </Modal>
  )
}

export default FormUser
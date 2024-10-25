import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import { InputPrimary, SubmitForm } from '../Inputs'
import { SelectPrimary } from '../Selects'
import SeccionForm from '../SeccionForm'
import { ArrowUpTrayIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { sweetAlert } from '@/helpers/getAlert'
import { ButtonDangerSm, ButtonPrimarySm } from '../Buttons'
import Image from 'next/image'

const dataForm = {
    id:null,
    user_type_document: "",
    user_number_document:"",
    user_name:"",
    user_last_name:"",
    user_cell_phone:"",
    user_phone:"",
    user_birthdate:"",
    user_gender:"",
    user_address:"",
    user_email:"",
    user_password:"sistema123",
    user_avatar: null
}
function FormUser({rolesData,typeDocumentsData,saveUser,dataUser,dataUserRol,statusModal,closeModal}) {
    const [deleteImg,setDeleteImg] = useState(false);
    const [form,setForm] = useState(dataForm);
    const [roles,setRoles] = useState([]);
    const filterLengthDocuments = typeDocumentsData.find(typeDocument => typeDocument.id == form.user_type_document)
    const digitDocuments = {
        min: filterLengthDocuments && filterLengthDocuments.document_minimun,
        max: filterLengthDocuments && filterLengthDocuments.document_length
    };
    const edit = Object.keys(dataUser).length;
    useEffect(()=>{
        setForm(edit ? dataUser : dataForm);
        setDeleteImg(false);
    },[dataUser]);
    useEffect(()=>{
        setRoles(dataUserRol ? dataUserRol : [])
    },[dataUserRol])
    useEffect(()=>{
        setForm(edit ? dataUser : dataForm);
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
            return sweetAlert({title : "Alerta", text: "Debes seleccionar al menos un rol", icon : "warning"});
        }
        const data = new FormData();
        for (const key in form) {
            if (Object.hasOwnProperty.call(form, key) && form[key] && key != 'user_avatar') {
                data.append(key,form[key])                
            }
        }
        if(form.id){
            data.append('_method','PUT');
            if(deleteImg){
                data.append('delete_img','true');
            }
        }
        data.append('roles',JSON.stringify(roles.map(role => role.id)))
        const inputImage = document.querySelector("#upload-file");
        if(inputImage.value){
            data.append('user_avatar',inputImage.files[0]);
        }
        saveUser(form.id,data);
    }
    const handleDeleteRole = (idRole) => {
        setRoles(roles.filter(role => role.id != idRole))
    }
    const handleSelectRole = (e) => {
        const roleSelect = rolesData.find(role => role.id == e.target.value);
        if(!roleSelect){
            return sweetAlert({title : "Alerta", text: "No se encontró el rol seleccionado", icon : "warning"});
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
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file){
            setForm({
                ...form,
                user_avatar : null
            })
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({
                ...form,
                user_avatar : reader.result
            })
        }
        if(file){
            reader.readAsDataURL(file);
        }
    }
    const handleClickUpload = (e) =>{
        document.querySelector("#upload-file").click();
    }
    const handleDeleteImg = () => {
        setForm({
            ...form,
            user_avatar:null
        })
        document.querySelector("#upload-file").value = null;
        setDeleteImg(true);
    }
  return (
    <Modal title={edit ? 'Editar usuario' : 'Nuevo usuario'} status={statusModal} onSave={handleSaveModal} handleCloseModal={closeModal}>
        <form className='grid grid-cols-12 gap-x-3 gap-y-0' onSubmit={handleSave}>
            <div className="col-span-full">
                <SeccionForm title="Datos personales"/>
            </div>
            <div className="col-span-full md:col-span-6">
                <SelectPrimary label="Tipo documento" name="user_type_document" value={form.user_type_document||''} onChange={handleChangeForm}>
                    <option value="">Ninguno</option>
                    {
                        typeDocumentsData.map(document => <option value={document.id} key={document.id}>{document.document_name}</option>)
                    }
                </SelectPrimary>
            </div>
            <div className="col-span-full md:col-span-6">
                <InputPrimary label="N° Documento" name="user_number_document" minLength={digitDocuments.min} maxLength={digitDocuments.max} inputRequired={digitDocuments.min && 'required'} value={form.user_number_document||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full md:col-span-6">
                <InputPrimary label="Nombres" name="user_name" inputRequired='required' value={form.user_name} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full md:col-span-6">
                <InputPrimary label="Apellidos" name="user_last_name" inputRequired='required' value={form.user_last_name} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full md:col-span-6 lg:col-span-4">
                <InputPrimary label="Celular" type='tel' inputRequired='required' name="user_cell_phone" value={form.user_cell_phone||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full md:col-span-6 lg:col-span-4">
                <InputPrimary label="Fecha nacimiento" name="user_birthdate" type='date' value={form.user_birthdate||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full md:col-span-6 lg:col-span-4">
                <SelectPrimary label="Género" name="user_gender" value={!form.user_gender ? 'N' : form.user_gender} onChange={handleChangeForm}>
                    <option value="N">No establecer</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                </SelectPrimary>            
            </div>
            <div className="col-span-full">
                <div className="flex gap-2 items-center">
                    <input type="file" id='upload-file' accept='image/*' hidden onChange={handleImageChange} />
                    <Image src={form.user_avatar ? form.user_avatar : "/img/no-pictures.png"} alt="Imagen previa" width={100} height={100} priority/>
                    <ButtonPrimarySm text="Subir" icon={<ArrowUpTrayIcon className='w-4 h-6'/>} onClick={handleClickUpload}/>
                    {form.user_avatar && <ButtonDangerSm text="Borrar" icon={<TrashIcon className='w-4 h-6'/>} onClick={handleDeleteImg}/>}
                </div>
            </div>
            <div className="col-span-full">
                <SeccionForm title="Datos del sistema"/>
            </div>
            <div className="col-span-full">
                <InputPrimary label="Correo" type='email' name="user_email" inputRequired='required' value={form.user_email} onChange={handleChangeForm}/>
            </div>
            {
                form.hasOwnProperty('user_password') && <div className="col-span-full md:col-span-6"><InputPrimary label="Contraseña" name="user_password" inputRequired='required' value={form.user_password} onChange={handleChangeForm}/></div>

            }
            <div className="col-span-full md:col-span-6">
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
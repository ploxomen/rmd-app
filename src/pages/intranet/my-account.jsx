import React, { useEffect, useState } from 'react'
import '@/app/globals.css';
import LoyoutIntranet from '@/components/LoyoutIntranet';
import apiAxios from '@/axios';
import { InputPrimary } from '@/components/Inputs';
import { SelectPrimary } from '@/components/Selects';
import SeccionForm from '@/components/SeccionForm';
import { ButtonDangerSm, ButtonPrimary, ButtonPrimarySm } from '@/components/Buttons';
import { ArrowUpTrayIcon, PaperAirplaneIcon, TrashIcon } from '@heroicons/react/24/solid';
import { getCookie } from '@/helpers/getCookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    if(!userCookie.authenticate){
        return {
            redirect : {
                destination: '/account/login',
                permanent:false
            }
        }
    }
    const contentCookieUser = JSON.parse(userCookie.authenticate);
    const headers = {
        'Authorization':'Bearer ' + contentCookieUser.access_token
    }
    let dataModules = [];
    let dataRoles = [];
    let dataUser = {
        user_name:"",
        user_last_name:"",
        user_avatar:null
    };
    try {
      const req = await apiAxios.get('/user/modules-roles',{headers,params:{url:'/my-account'}});
      if(req.data.redirect){
        return {
            redirect : {
                destination: req.data.redirect,
                permanent:false
            }
        }
      }
      dataModules = req.data.modules;
      dataRoles = req.data.roles;
      dataUser = req.data.user;
      return {
        props:{
            dataModules,
            dataRoles,
            dataUser            
            }
        }
    } catch {
        return {
            props:{
              dataModules,
              dataRoles,
              dataUser            
          }
        }
    }
}
const defaulForm = {
    user_type_document:"",
    user_number_document:"",
    user_name:"",
    user_last_name:"",
    user_cell_phone:"",
    user_birthdate:"",
    user_gender:"",
    user_email:"",
    user_avatar:null
}
function MyAccount({dataUser,dataModules,dataRoles}) {
    const [form,setForm] = useState(defaulForm);
    const headers = getCookie();
    const route = useRouter();
    const [typeDocumentsData,setTypeDocumentsData] = useState([]);
    const filterLengthDocuments = typeDocumentsData.find(typeDocument => typeDocument.id == form.user_type_document)
    const digitDocuments = {min:filterLengthDocuments && filterLengthDocuments.id == 5 ? 1 : (filterLengthDocuments && filterLengthDocuments.document_length),max: filterLengthDocuments && filterLengthDocuments.document_length};
    useEffect(()=>{
        const getRoles = async () => {
            try {
                const resp = await apiAxios.get('/type-documents',{headers});
                if(resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                setTypeDocumentsData(resp.data.data)
            } catch (error) {
                alert("Error al obtener los tipos de documentos")
            }
        }
        getRoles();
    },[])
    useEffect(()=>{
        const getRoles = async () => {
            try {
                const resp = await apiAxios.get('/my-info',{headers});
                if(resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                const img = resp.data.data.user_avatar ? process.env.NEXT_PUBLIC_API_URL + '/' +  resp.data.data.user_avatar : null;
                setForm({...resp.data.data,user_avatar:img})
            } catch (error) {
                console.error(error);
                alert("Error al obtener los tipos del usuario")
            }
        }
        getRoles();
    },[])
    const handleChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }
    const handleDeleteImg = () => {
        setForm({
            ...form,
            user_avatar:null
        })
        document.querySelector("#upload-file").value = null;
    }
    const handleClickUpload = () => {
        document.querySelector("#upload-file").click();
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({
                    ...form,
                    user_avatar : reader.result
                })
            }
            reader.readAsDataURL(file);
        }else{
            setForm({
                ...form,
                user_avatar : null
            })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in form) {
            if (Object.hasOwnProperty.call(form, key) && form[key] && key != 'user_avatar') {
                data.append(key,form[key])                
            }
        }
        data.append('_method','PUT');
        if(!form.user_avatar){
            data.append('delete_img','true');
        }
        const inputImage = document.querySelector("#upload-file");
        if(inputImage.value){
            data.append('avatar',inputImage.files[0]);
        }
        try {
            const resp = await apiAxios.post('/my-account',data,{
                headers:{
                    "Content-Type":"multipart/form-data",
                    ...headers
                }
            });
            if(resp.data.error){
                resp.data.data.forEach(error => {
                    alert(error)
                });
                return
            }
            alert(resp.data.message);
        } catch (error) {
            console.error(error)
            alert('Error al actualizar los datos de mi perfil')
        }
    }
    return(
        <LoyoutIntranet title="Mi perfil" description="Configuración de datos de mi perfil" user={dataUser} modules={dataModules} roles={dataRoles}>
            <form className='w-full p-6 mb-4 bg-white rounded-md shadow grid grid-cols-12 gap-x-3 gap-y-0' onSubmit={handleSubmit}>
                <div className="col-span-full">
                    <SeccionForm title="Datos personales"/>
                </div>
                <div className="col-span-full flex gap-2 items-center mb-3">
                    <input type="file" id='upload-file' accept='image/*' hidden onChange={handleImageChange} />
                    <Image src={form.user_avatar ? form.user_avatar : "/img/user.png"} alt="Imagen avatar" width={100} height={100} quality={100} priority/>
                    <ButtonPrimarySm text="Subir" icon={<ArrowUpTrayIcon className='w-4 h-6'/>} onClick={handleClickUpload}/>
                    {form.user_avatar && <ButtonDangerSm text="Borrar" icon={<TrashIcon className='w-4 h-6'/>} onClick={handleDeleteImg}/>}
                </div>
                <div className="col-span-6">
                    <InputPrimary label="Nombres" name="user_name" inputRequired='required' value={form.user_name} onChange={handleChangeForm}/>
                </div>
                <div className="col-span-6">
                    <InputPrimary label="Apellidos" name="user_last_name" inputRequired='required' value={form.user_last_name} onChange={handleChangeForm}/>
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
                    <InputPrimary label="N° Documento" name="user_number_document" minLength={digitDocuments.min} maxLength={digitDocuments.max} disabled={digitDocuments.min && digitDocuments.max ? '' : 'disabled'} inputRequired={digitDocuments.min && 'required'} value={form.user_number_document||''} onChange={handleChangeForm}/>
                </div>
                <div className="col-span-6">
                    <InputPrimary label="Correo" disabled="disabled" type='email' inputRequired='required' name="user_email" value={form.user_email||''} onChange={handleChangeForm}/>
                </div>
                <div className="col-span-4">
                    <InputPrimary label="Celular" type='tel' inputRequired='required' name="user_cell_phone" value={form.user_cell_phone||''} onChange={handleChangeForm}/>
                </div>
                <div className="col-span-4">
                    <InputPrimary label="Fecha nacimiento" name="user_birthdate" type='date' value={form.user_birthdate||''} onChange={handleChangeForm}/>
                </div>
                <div className="col-span-4">
                    <SelectPrimary label="Género" name="user_gender" value={!form.user_gender ? 'N' : form.user_gender} onChange={handleChangeForm}>
                        <option value="N">No establecer</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </SelectPrimary>            
                </div>
                <div className="col-span-full text-center">
                    <ButtonPrimary text="Actualizar" type='submit' icon={<PaperAirplaneIcon className='w-5 h-5'/>}/>
                </div>
            </form>
        </LoyoutIntranet>
    )
}

export default MyAccount
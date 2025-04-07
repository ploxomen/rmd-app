import React, { useEffect, useState } from 'react'
import SeccionForm from '../SeccionForm'
import { InputPrimary, SubmitForm } from '../Inputs'
import { ButtonDanger, ButtonSecondarySm } from '../Buttons'
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid'
import { getCookie } from '@/helpers/getCookie'
import Modal from '../Modal'
import apiAxios from '@/axios'
import { sweetAlert } from '@/helpers/getAlert'
const dataForm = {
    id:null,
    categorie_name:""
}
function FormCategorie({statusModal,handleSave,closeModal,categorieEdit,subCategoriesEdit}) {
    const [form,setForm] = useState(dataForm);
    const [subCategories,setSubCategories] = useState([]);
    const headers = getCookie();
    const edit = Object.keys(categorieEdit).length;
    useEffect(()=>{
        setForm(edit ? categorieEdit : dataForm);
    },[categorieEdit]);
    useEffect(()=>{
        setSubCategories(subCategoriesEdit ? subCategoriesEdit : []);
    },[subCategoriesEdit]);
    const handleChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }
    const handleSubCategorie= () => {
        setSubCategories([
            ...subCategories,
            {
                id:(new Date).getTime(),
                sub_categorie_name:"",
                type:"new",
            }
        ])
    }
    const handleChangeSubCategorie = (id,column,value) => {
        let cloneSubCategorie = subCategories.slice();
        cloneSubCategorie = cloneSubCategorie.map(categorie => categorie.id == id ? {...categorie,[column] : value} : categorie)
        setSubCategories(cloneSubCategorie);
    }
    const handleDeleteSubCategorie = async (id) => {
        const subCategorie = subCategories.find(subCate => subCate.id == id);
        const question = await sweetAlert({title : "Mensaje", text: "¿Deseas eliminar esta subcategoría?", icon : "question",showCancelButton:true});
        if(!question.isConfirmed){
            return
        }
        if(subCategorie.type === 'old'){
            try {
                const resp = await apiAxios.delete('/categorie-subcategorie/' + id,{headers});
                if(resp.data.error){
                    return sweetAlert({title : "Alerta", text: resp.data.message, icon : "warning"});
                }
                return sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
            } catch (error) {
                console.error(error);
                return sweetAlert({title : "Error", text: 'Ocurrió un error al eliminar la subcategoría', icon : "error"});
            }
        }
        setSubCategories(subCategories.filter(subCategorie => subCategorie.id != id));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!subCategories.length){
            const question = await sweetAlert({title : "Mensaje", text: "¿Deseas agregar la categoría sin subcategorías?", icon : "question",showCancelButton:true});
            if(!question.isConfirmed){
                return
            }
        }
        handleSave(form,subCategories);
    }
    const hanbleSendModal = () => {
        const formCategorie = document.querySelector("#form-categorie-submit");
        formCategorie.click();
    }
    return (
        <Modal status={statusModal} title={edit ? 'Editar categoría' : 'Nuevo categoría'} onSave={hanbleSendModal} handleCloseModal={closeModal}>
            <form  className='grid grid-cols-6 gap-x-3 gap-y-0' onSubmit={handleSubmit}>
                <div className="col-span-full">
                    <SeccionForm title="Datos categoría"/>
                </div>
                <div className="col-span-full">
                    <InputPrimary label="Nombre" inputRequired='required' name="categorie_name" value={form.categorie_name||''} onChange={handleChangeForm}/>
                </div>
                
                <div className="col-span-full flex justify-between items-center gap-2 mb-2">
                    <SeccionForm title="Datos subcategorías"/>
                    <ButtonSecondarySm icon={<PlusCircleIcon className='w-5 h-5'/>} text="Agregar" onClick={handleSubCategorie}/>
                </div>
                <div className="col-span-full">
                    {
                        !subCategories.length ? <span className='text-red-500'>No se asignaron subcategorías</span>
                        : 
                        subCategories.map(subcategorie => (
                        <div className='grid grid-cols-6 gap-x-2 items-center' key={subcategorie.id}>
                            <div className='col-span-5'>
                                <InputPrimary label="Nombre" inputRequired='required' value={subcategorie.sub_categorie_name||''} name={`subcategoriename${subcategorie.id}`} onChange={e => handleChangeSubCategorie(subcategorie.id,'sub_categorie_name',e.target.value)}/>
                            </div>
                            <div className='col-span-1'>
                                <ButtonDanger icon={<TrashIcon className='w-4 h-4'/>} onClick={e => handleDeleteSubCategorie(subcategorie.id)}/>
                            </div>
                        </div>
                        ))
                    }
                </div>
                <SubmitForm id="form-categorie-submit"/>
            </form>
        </Modal>
      )
}

export default FormCategorie